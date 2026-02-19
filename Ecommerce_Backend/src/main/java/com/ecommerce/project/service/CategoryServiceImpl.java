package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourseNotFoundException;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;
import com.ecommerce.project.repository.CategoryRepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

// for promote loose coupling
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepo  categoryRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CategoryResponse getAllCategories(Integer pageNumber, Integer pageSize , String sortBy , String sortOrder) {

        Sort sortByAndOrder =  sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();


        Pageable pageDetail = PageRequest.of(pageNumber , pageSize , sortByAndOrder);
        Page categoryPage =  categoryRepo.findAll(pageDetail);



        List<Category> categories = categoryPage.getContent(); // this will return  list of content

        if(categories.isEmpty())
        {
            throw  new APIException("No Category Created Till Now");
        }
        List<CategoryDTO> categoryDTOS = categories.stream().map(category ->
            modelMapper.map(category,CategoryDTO.class)).toList();

        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setContent(categoryDTOS);
        categoryResponse.setPageNumber(categoryPage.getNumber());
        categoryResponse.setPageSize(categoryPage.getSize());
        categoryResponse.setTotalPages(categoryPage.getTotalPages());
        categoryResponse.setTotalElements(categoryPage.getTotalElements());
        categoryResponse.setLastPage(categoryPage.isLast());

        return categoryResponse;
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDto) {
        Category category = modelMapper.map(categoryDto,Category.class);
        Category categoryFromDb = categoryRepo.findByCategoryName(categoryDto.getCategoryName());
        if(categoryFromDb != null){
            throw new APIException("Category With the name" + categoryFromDb.getCategoryName() + " already exists!!!");

        }
        Category savedCategory = categoryRepo.save(category);
        return modelMapper.map(savedCategory,CategoryDTO.class);

    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourseNotFoundException("Category" , "CateoryId" ,  categoryId));

        categoryRepo.delete(category);
        return modelMapper.map( category,CategoryDTO.class);
    }

    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId) {
           Category savedCategory  = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ResourseNotFoundException("Category" , "CateoryId" ,  categoryId));

        Category category = modelMapper.map(categoryDTO,Category.class);
        category.setCategoryName(category.getCategoryName());
        category.setCategoryId(categoryId);

         savedCategory = categoryRepo.save(category);
        return modelMapper.map(savedCategory,CategoryDTO.class);
    }
}
