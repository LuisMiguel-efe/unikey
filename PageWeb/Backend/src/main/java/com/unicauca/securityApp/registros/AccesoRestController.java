package com.unicauca.securityApp.registros;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/accesos")
public class AccesoRestController {
    private final AccesoService accesoService;

    @GetMapping
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Acceso> findByPorteria(@RequestParam int porteria) {
        return accesoService.findByPorteria(porteria);
    }

    @GetMapping("/all")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Acceso> getAllAccesos() {
        return accesoService.getAllAccesos();
    }
}
