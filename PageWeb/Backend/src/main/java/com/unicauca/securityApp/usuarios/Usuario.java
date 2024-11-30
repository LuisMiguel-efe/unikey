package com.unicauca.securityApp.usuarios;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Usuario {
    private int in;
    @Id
    private String cedula;

    private String nombre;

    private String tipo;

}
