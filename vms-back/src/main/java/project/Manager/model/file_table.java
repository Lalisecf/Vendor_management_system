package project.Manager.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class file_table {
    private Long id;
    private String path;
    private String status;
    private String availability;
    private long payment_id;
    private String crtd;
    private String name;
    
}
