package devKaua.projeto.controller;

import devKaua.projeto.dto.AdotanteRequestDTO;
import devKaua.projeto.dto.AdotanteResponseDTO;
import devKaua.projeto.service.AdotanteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/adotantes")
@RequiredArgsConstructor
@Tag(name = "Adotantes", description = "Endpoints para gerenciamento do cadastro de adotantes")
@SecurityRequirement(name = "bearer-key")
public class AdotanteController {

    private final AdotanteService adotanteService;

    @Operation(summary = "Cadastrar novo adotante", description = "Registra um novo adotante no sistema com validação de dados.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Adotante cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos (falha de validação)"),
            @ApiResponse(responseCode = "403", description = "Acesso negado / Token JWT inválido ou ausente")
    })
    @PostMapping
    public ResponseEntity<AdotanteResponseDTO> cadastrar(@RequestBody @Valid AdotanteRequestDTO dto) {
        AdotanteResponseDTO response = adotanteService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Buscar adotante por ID", description = "Retorna os detalhes de um adotante específico com base no ID fornecido.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Adotante encontrado"),
            @ApiResponse(responseCode = "404", description = "Adotante não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AdotanteResponseDTO> buscarPorId(
            @Parameter(description = "ID do adotante", example = "1") @PathVariable Long id) {
        AdotanteResponseDTO response = adotanteService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar todos os adotantes", description = "Retorna uma lista paginada de todos os adotantes cadastrados.")
    @ApiResponse(responseCode = "200", description = "Página de adotantes recuperada com sucesso")
    @GetMapping
    public ResponseEntity<Page<AdotanteResponseDTO>> listarTodos(
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<AdotanteResponseDTO> page = adotanteService.listarTodos(pageable);
        return ResponseEntity.ok(page);
    }

    @Operation(summary = "Atualizar adotante", description = "Atualiza os dados de um adotante existente pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Adotante atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados fornecidos são inválidos"),
            @ApiResponse(responseCode = "404", description = "Adotante não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<AdotanteResponseDTO> atualizar(
            @Parameter(description = "ID do adotante", example = "1") @PathVariable Long id,
            @RequestBody @Valid AdotanteRequestDTO dto) {
        AdotanteResponseDTO response = adotanteService.atualizar(id, dto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Remover adotante", description = "Exclui permanentemente o cadastro de um adotante pelo ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Adotante removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Adotante não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID do adotante", example = "1") @PathVariable Long id) {
        adotanteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}