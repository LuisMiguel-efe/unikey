package com.unicauca.securityApp.porteria;

import org.springframework.stereotype.Service;

@Service
public class PorteriaService {
    private final PorteriaRepository porterias;

    public PorteriaService(PorteriaRepository porterias) {
        this.porterias = porterias;
    }

    public Porteria save(Porteria porteria) {
        return porterias.save(porteria);
    }



    public Iterable<Porteria> findAll() {
        return
                porterias.findAll();
    }

    public void deleteById(String id) {
        Porteria porteria = porterias.findById(id).orElseThrow(() -> new RuntimeException("Porteria no encontrada"));
        porterias.delete(porteria);
    }
}
