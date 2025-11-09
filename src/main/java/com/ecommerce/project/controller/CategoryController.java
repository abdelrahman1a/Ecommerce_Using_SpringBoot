package com.ecommerce.project.controller;


import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;
import com.ecommerce.project.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }



    @GetMapping("/public/categories")
    public ResponseEntity< CategoryResponse> getCategories(@RequestParam(name="pageNumber" , defaultValue = AppConstants.pageNumber) Integer pageNumber,
                                                           @RequestParam(name = "pageSize" ,defaultValue = AppConstants.pageSize) Integer pageSize ,
                                                           @RequestParam(name = "sortBy" ,defaultValue = AppConstants.sortCategoriesBy) String sortBy  ,
                                                           @RequestParam(name = "sortOrder" ,defaultValue = AppConstants.sortOrder) String sortOrder) {
        CategoryResponse categoryResponse = categoryService.getAllCategories(pageNumber , pageSize , sortBy, sortOrder);
        return  new ResponseEntity<>(categoryResponse , HttpStatus.OK);
    }

    @PostMapping("/public/categories")
    public ResponseEntity<CategoryDTO> createCategory(@Valid  @RequestBody CategoryDTO categoryDto) {
        CategoryDTO savedCategoryDto =   categoryService.createCategory(categoryDto);
        return new ResponseEntity<>(savedCategoryDto  ,HttpStatus.CREATED) ;
    }

    @DeleteMapping("/admin/delete/{categoryId}")
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable Long categoryId)
    {
            CategoryDTO deletedCategoryDto = categoryService.deleteCategory(categoryId);
            return  new ResponseEntity(deletedCategoryDto , HttpStatus.OK);
    }

    @PutMapping("/admin/update/{categoryId}")
    public ResponseEntity<CategoryDTO> upateCategory(@Valid @RequestBody CategoryDTO categoryDto ,  @PathVariable Long categoryId)
    {
        CategoryDTO savedCategoory = categoryService.updateCategory(categoryDto , categoryId);
            return  new ResponseEntity(savedCategoory , HttpStatus.OK);

    }


}
