package com.ecommerce.project.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public String uploadImage(String path, MultipartFile image) throws IOException {
        String originalFileName = image.getOriginalFilename();
        String randomId = UUID.randomUUID().toString();

        // joining random id with extension for ex : 123.jpg , er3.png ..
        String fileName = randomId.concat(originalFileName.substring(originalFileName.lastIndexOf('.')));

        // putting full path
        String filePath = path + File.separator + fileName;

        // check if path exist and create
        File folder = new File(path);
        if(!folder.exists()){
            folder.mkdir();
        }

        Files.copy(image.getInputStream() ,  Paths.get(filePath));

        // returning fileName
        return fileName ;
    }
}
