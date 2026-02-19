package com.ecommerce.project.controller;


import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;
import com.ecommerce.project.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @Tag(name = "Category APIS", description = "APIS For Managing Categories")
    @Operation(summary = "Get All Categories", description = "API To get All Categories")
    @GetMapping("/public/categories")
    public ResponseEntity<CategoryResponse> getCategories(@RequestParam(name = "pageNumber", defaultValue = AppConstants.pageNumber) Integer pageNumber,
                                                          @RequestParam(name = "pageSize", defaultValue = AppConstants.pageSize) Integer pageSize,
                                                          @RequestParam(name = "sortBy", defaultValue = AppConstants.sortCategoriesBy) String sortBy,
                                                          @RequestParam(name = "sortOrder", defaultValue = AppConstants.sortOrder) String sortOrder) {
        CategoryResponse categoryResponse = categoryService.getAllCategories(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(categoryResponse, HttpStatus.OK);
    }

    @Tag(name = "Category APIS", description = "APIS For Managing Categories")
    @Operation(summary = "create Category", description = "API To Create a new Category")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Category is created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid Input"),
            @ApiResponse(responseCode = "500", description = "Internal Server error")
    })
    @PostMapping("/public/categories")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO categoryDto) {
        CategoryDTO savedCategoryDto = categoryService.createCategory(categoryDto);
        return new ResponseEntity<>(savedCategoryDto, HttpStatus.CREATED);
    }

    @Operation(summary = "Delete Category", description = "API To Delete Category By Id")
    @DeleteMapping("/admin/delete/{categoryId}")
    public ResponseEntity<CategoryDTO> deleteCategory(@Parameter(description = "categoryId you want to delete") @PathVariable Long categoryId) {
        CategoryDTO deletedCategoryDto = categoryService.deleteCategory(categoryId);
        return new ResponseEntity(deletedCategoryDto, HttpStatus.OK);
    }

    @Operation(summary = "Update Category", description = "API To Update Category By Id")
    @PutMapping("/admin/update/{categoryId}")
    public ResponseEntity<CategoryDTO> upateCategory(@Valid @RequestBody CategoryDTO categoryDto, @PathVariable Long categoryId) {
        CategoryDTO savedCategoory = categoryService.updateCategory(categoryDto, categoryId);
        return new ResponseEntity(savedCategoory, HttpStatus.OK);

    }


}
