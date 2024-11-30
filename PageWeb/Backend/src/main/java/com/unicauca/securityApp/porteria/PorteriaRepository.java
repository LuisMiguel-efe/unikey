package com.unicauca.securityApp.porteria;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface PorteriaRepository extends MongoRepository<Porteria, String> {

}
