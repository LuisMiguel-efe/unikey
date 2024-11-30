package com.unicauca.securityApp.registros;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Acceso {
    private String cedula;
    private int porteria;
    private String fecha_hora;
    private Boolean autenticado;

}
