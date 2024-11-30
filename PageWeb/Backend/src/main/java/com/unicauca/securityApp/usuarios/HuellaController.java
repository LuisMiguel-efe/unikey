package com.unicauca.securityApp.usuarios;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/huella")
public class HuellaController {
    @PostMapping
    public void guardarHuella(@RequestBody Huella huellas) {
        System.out.println(huellas.getTemplates());
    }

}
