package com.unicauca.securityApp.porteria;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/porterias")
@AllArgsConstructor
public class PorteriaRestController {
    private final PorteriaService service;
     @PostMapping
     @CrossOrigin(origins = "http://localhost:4200")
    public Porteria save(@RequestBody Porteria porteria) {
        return service.save(porteria);
}
@GetMapping
@CrossOrigin(origins = "http://localhost:4200")
    public Iterable<Porteria> findAll() {

         return service.findAll();
    }
    @PutMapping
    @CrossOrigin(origins = "http://localhost:4200")
    public Porteria update(@RequestBody Porteria porteria) {
        return service.save(porteria);
    }
    @DeleteMapping
    @CrossOrigin(origins = "http://localhost:4200")
    public void delete(@RequestParam String id) {
        service.deleteById(id);
    }

}