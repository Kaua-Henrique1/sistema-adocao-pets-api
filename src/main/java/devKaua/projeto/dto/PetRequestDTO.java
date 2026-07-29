package devKaua.projeto.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetRequestDTO {

    @NotBlank(message = "O nome é obrigatório.")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ]+(\\s+[A-Za-zÀ-ÿ]+)*$", message = "Nome inválido! Use apenas letras e espaços.")
    private String nome;

    @NotBlank(message = "O tipo é obrigatório (Ex: CACHORRO, GATO).")
    private String tipo;

    @NotBlank(message = "O sexo é obrigatório (Ex: MACHO, FEMEA).")
    private String sexo;

    @NotBlank(message = "A raça é obrigatória.")
    @Pattern(regexp = "^[a-zA-ZÀ-ÿ\\s]+$", message = "Raça inválida! Escreva apenas letras.")
    private String raca;

    @NotNull(message = "A idade é obrigatória.")
    @DecimalMin(value = "0.1", message = "Idade inválida! Mínimo de 0.1 ano.")
    @DecimalMax(value = "60.0", message = "Idade inválida! Máximo de 60 anos.")
    private Double idade;

    @NotNull(message = "O peso é obrigatório.")
    @DecimalMin(value = "0.5", message = "Peso inválido! Mínimo de 0.5 kg.")
    @DecimalMax(value = "60.0", message = "Peso inválido! Máximo de 60 kg.")
    private Double peso;

    @Valid
    @NotNull(message = "O endereço é obrigatório.")
    private EnderecoDTO endereco;
}