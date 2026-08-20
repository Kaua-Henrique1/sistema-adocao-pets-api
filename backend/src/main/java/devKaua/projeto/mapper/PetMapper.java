package devKaua.projeto.mapper;

import devKaua.projeto.domain.Pet;
import devKaua.projeto.dto.PetRequestDTO;
import devKaua.projeto.dto.PetResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PetMapper {

    private final EnderecoMapper enderecoMapper;

    public Pet toEntity(PetRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return Pet.builder()
                .nome(dto.getNome())
                .tipo(dto.getTipo())
                .sexo(dto.getSexo())
                .raca(dto.getRaca())
                .dataNascimento(dto.getDataNascimento())
                .peso(dto.getPeso())
                .endereco(enderecoMapper.toEntity(dto.getEndereco()))
                .build();
    }

    public PetResponseDTO toDTO(Pet entity) {
        if (entity == null) {
            return null;
        }

        Long tutorId = entity.getTutor() != null ? entity.getTutor().getId() : null;
        String tutorNome = entity.getTutor() != null ? entity.getTutor().getNome() : null;

        return PetResponseDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .tipo(entity.getTipo())
                .sexo(entity.getSexo())
                .raca(entity.getRaca())
                .dataNascimento(entity.getDataNascimento())
                .peso(entity.getPeso())
                .tutorId(tutorId)
                .tutorNome(tutorNome)
                .endereco(enderecoMapper.toDTO(entity.getEndereco()))
                .createdAt(entity.getCreatedAt())
                .build();
    }
}