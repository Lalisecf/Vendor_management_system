package project.maker.model;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileTable {
    private Long id;
    private String name;
    private String path;
    private String status;
    private String availability;
    private Long payment_id;
    private MultipartFile document;
    private String crtd;

}