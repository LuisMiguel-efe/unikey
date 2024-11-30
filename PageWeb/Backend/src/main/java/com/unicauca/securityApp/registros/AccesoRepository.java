package com.unicauca.securityApp.registros;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccesoRepository  extends MongoRepository<Acceso, String> {
    @Query("{ 'porteria' : ?0 }")
    List<Acceso> findByPorteria(int porteria);
}
