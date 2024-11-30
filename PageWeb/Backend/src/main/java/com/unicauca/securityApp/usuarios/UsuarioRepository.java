package com.unicauca.securityApp.usuarios;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Usuario findByCedula(String cedula);
}
