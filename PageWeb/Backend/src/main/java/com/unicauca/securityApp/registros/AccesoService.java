package com.unicauca.securityApp.registros;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@AllArgsConstructor
public class AccesoService {

    private final AccesoRepository accesos;
    public List<Acceso> findByPorteria(int porteria) {
        List<Acceso> accesosList = accesos.findByPorteria(porteria);
        return accesosList;

    }
    public List<Acceso> getAllAccesos() {
        return accesos.findAll();
    }


}
