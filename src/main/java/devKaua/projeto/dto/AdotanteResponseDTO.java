package devKaua.projeto.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdotanteResponseDTO {

    private Long id;
    private String nome;
    private String cpf;
    private String telefone;
    private String email;
    private EnderecoDTO endereco;
    private LocalDateTime createdAt;
}