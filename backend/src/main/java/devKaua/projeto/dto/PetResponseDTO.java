package devKaua.projeto.dto;

import devKaua.projeto.domain.Sexo;
import devKaua.projeto.domain.TipoAnimal;
import lombok.Builder;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
public record PetResponseDTO(
        Long id,
        String nome,
        TipoAnimal tipo,
        Sexo sexo,
        String raca,
        LocalDate dataNascimento,
        Double peso,
        Long tutorId,
        String tutorNome,
        EnderecoDTO endereco,
        LocalDateTime createdAt
) {}