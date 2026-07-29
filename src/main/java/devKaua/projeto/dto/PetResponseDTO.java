package devKaua.projeto.dto;

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
    private String tipo;
    private String sexo;
    private String raca;
    private Double idade;
    private Double peso;
    private Long tutorId;
    private String tutorNome;
    private EnderecoDTO endereco;
    private LocalDateTime createdAt;
}