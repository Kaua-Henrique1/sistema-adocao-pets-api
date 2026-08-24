package devKaua.projeto.controller;

import devKaua.projeto.domain.user.Usuario;
import devKaua.projeto.dto.AuthenticationDTO;
import devKaua.projeto.dto.LoginResponseDTO;
import devKaua.projeto.dto.RegisterDTO;
import devKaua.projeto.infra.security.TokenService;
import devKaua.projeto.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
@Tag(name = "Autenticação", description = "Endpoints de login e registro de usuários do sistema")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private TokenService tokenService;

    @Operation(summary = "Realizar Login", description = "Autentica o usuário e retorna um Token JWT para acessar as rotas protegidas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso (retorna o Token JWT)"),
            @ApiResponse(responseCode = "400", description = "Dados de autenticação inválidos ou campos incorretos"),
            @ApiResponse(responseCode = "403", description = "Credenciais incorretas")
    })
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((Usuario) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @Operation(summary = "Registrar novo Usuário", description = "Cadastra uma nova conta no sistema (Restrito a administradores).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Login já cadastrado ou dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Acesso negado / Requer perfil de Administrador")
    })
    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
        if (this.repository.findByLogin(data.login()) != null) {
            return ResponseEntity.badRequest().body("Login já cadastrado no sistema.");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.senha());
        Usuario newUser = new Usuario(data.login(), encryptedPassword, data.role());

        this.repository.save(newUser);

        return ResponseEntity.ok().build();
    }
}