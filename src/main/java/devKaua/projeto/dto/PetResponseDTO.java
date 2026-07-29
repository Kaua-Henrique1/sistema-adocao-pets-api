package devKaua.projeto.dto;

import devKaua.projeto.domain.Sexo;
import devKaua.projeto.domain.TipoAnimal;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponseDTO {

    private Long id;
    private String nome;
    private TipoAnimal tipo;
    private Sexo sexo;
    private String raca;
    private Double idade;
    private Double peso;
    private Long tutorId;
    private String tutorNome;
    private EnderecoDTO endereco;
    private LocalDateTime createdAt;
}