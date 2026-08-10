package devKaua.projeto.controller;

import devKaua.projeto.dto.PetRequestDTO;
import devKaua.projeto.dto.PetResponseDTO;
import devKaua.projeto.service.PetService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/pets")
@RequiredArgsConstructor
@Tag(name = "Pets", description = "Endpoints para gerenciamento do cadastro e fluxo de adoção de pets")
@SecurityRequirement(name = "bearer-key")
public class PetController {

    private final PetService petService;

    @Operation(summary = "Cadastrar novo pet", description = "Registra um novo pet disponível para adoção no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pet cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos"),
            @ApiResponse(responseCode = "403", description = "Acesso negado / Token JWT inválido ou ausente")
    })
    @PostMapping
    public ResponseEntity<PetResponseDTO> cadastrar(@RequestBody @Valid PetRequestDTO dto) {
        PetResponseDTO response = petService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Buscar pet por ID", description = "Retorna as informações detalhadas de um pet específico pelo ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pet encontrado"),
            @ApiResponse(responseCode = "404", description = "Pet não encontrado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado / Token JWT inválido ou ausente")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PetResponseDTO> buscarPorId(
            @Parameter(description = "ID do pet", example = "1") @PathVariable Long id) {
        PetResponseDTO response = petService.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Listar pets disponíveis", description = "Retorna todos os pets que ainda estão com status de disponíveis para adoção.")
    @ApiResponse(responseCode = "200", description = "Lista de pets disponíveis obtida com sucesso")
    @GetMapping("/disponiveis")
    public ResponseEntity<List<PetResponseDTO>> listarDisponiveis() {
        List<PetResponseDTO> disponiveis = petService.listarDisponiveis();
        return ResponseEntity.ok(disponiveis);
    }

    @Operation(summary = "Listar pets por cidade", description = "Filtra e retorna os pets cadastrados em uma determinada cidade com paginação.")
    @ApiResponse(responseCode = "200", description = "Página de pets da cidade consultada")
    @GetMapping("/cidade/{cidade}")
    public ResponseEntity<Page<PetResponseDTO>> listarPorCidade(
            @Parameter(description = "Nome da cidade", example = "São Paulo") @PathVariable String cidade,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        Page<PetResponseDTO> page = petService.listarPorCidade(cidade, pageable);
        return ResponseEntity.ok(page);
    }

    @Operation(summary = "Realizar processo de adoção", description = "Vincula um pet disponível a um adotante existente, alterando o status do pet para 'ADOTADO'.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Adoção realizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Pet já foi adotado ou requisição inválida"),
            @ApiResponse(responseCode = "404", description = "Pet ou Adotante não encontrado")
    })
    @PatchMapping("/{petId}/adotar")
    public ResponseEntity<PetResponseDTO> adotarPet(
            @Parameter(description = "ID do pet a ser adotado", example = "1") @PathVariable Long petId,
            @Parameter(description = "ID do adotante", example = "2") @RequestParam Long adotanteId) {
        PetResponseDTO response = petService.adotarPet(petId, adotanteId);
        return ResponseEntity.ok(response);
    }
}