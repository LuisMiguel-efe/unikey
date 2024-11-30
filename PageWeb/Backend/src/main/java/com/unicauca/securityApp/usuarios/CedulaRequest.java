package com.unicauca.securityApp.usuarios;

public class CedulaRequest {
    private String cedula;

    public CedulaRequest() {
    }

    public CedulaRequest(String cedula) {
        this.cedula = cedula;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }
}
