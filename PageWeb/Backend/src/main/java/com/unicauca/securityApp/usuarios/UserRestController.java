package com.unicauca.securityApp.usuarios;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserRestController {
private final UsuarioService usuarioService;
@PostMapping
@CrossOrigin(origins = "http://localhost:4200")
    public void guardarUsuario(@RequestBody  Usuario usuario) {

    usuarioService.guardarUsuario( usuario);
    }
    @GetMapping
    @CrossOrigin(origins = "http://localhost:4200")
  //metodo para obtener todos los usaurios con paginacion
    public List<Usuario> obtenerUsuarios(@RequestParam int page, @RequestParam int size) {

        return usuarioService.obtenerUsuarios(page, size).getContent();
    }

    @DeleteMapping
    @CrossOrigin(origins = "http://localhost:4200")
    public void eliminarUsuario(@RequestParam String cedula) {
        usuarioService.eliminarUsuario(cedula);
    }
    @PutMapping
    @CrossOrigin(origins = "http://localhost:4200")
    public void actualizarUsuario( @RequestBody Usuario usuario) {
        usuarioService.actualizarUsuario(usuario);
    }



}
