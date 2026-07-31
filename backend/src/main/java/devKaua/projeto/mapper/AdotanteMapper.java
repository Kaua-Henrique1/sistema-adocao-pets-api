package devKaua.projeto.mapper;

import devKaua.projeto.domain.Adotante;
import devKaua.projeto.dto.AdotanteRequestDTO;
import devKaua.projeto.dto.AdotanteResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdotanteMapper {

    private final EnderecoMapper enderecoMapper;

    public Adotante toEntity(AdotanteRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Adotante.builder()
                .nome(dto.getNome())
                .cpf(dto.getCpf())
                .telefone(dto.getTelefone())
                .email(dto.getEmail())
                .endereco(enderecoMapper.toEntity(dto.getEndereco()))
                .build();
    }

    public AdotanteResponseDTO toDTO(Adotante entity) {
        if (entity == null) {
            return null;
        }
        return AdotanteResponseDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .cpf(entity.getCpf())
                .telefone(entity.getTelefone())
                .email(entity.getEmail())
                .endereco(enderecoMapper.toDTO(entity.getEndereco()))
                .createdAt(entity.getCreatedAt())
                .build();
    }
}