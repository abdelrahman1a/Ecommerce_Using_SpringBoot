package com.ecommerce.project.exceptions;

public class ResourseNotFoundException extends RuntimeException {

    private String resourceName;
    private String field;
    private String fieldName;
    private Long fieldId;


    public ResourseNotFoundException() {
    }

    public ResourseNotFoundException( String resourceName, String field, String fieldName) {
        super(String.format("%s not found with %s: %s", resourceName , field, fieldName ));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldName = fieldName;
    }

    public ResourseNotFoundException( String resourceName, String field, Long fieldId) {
        super(String.format("%s not found with %s: %d", resourceName , field, fieldId ));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldId = fieldId;
    }

}
