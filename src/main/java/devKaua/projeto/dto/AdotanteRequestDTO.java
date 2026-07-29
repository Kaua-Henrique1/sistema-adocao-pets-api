package devKaua.projeto.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdotanteRequestDTO {

    @NotBlank(message = "O nome é obrigatório.")
    @Pattern(regexp = "^[A-Za-zÀ-ÿ]+(\\s+[A-Za-zÀ-ÿ]+)+$", message = "Nome inválido! Use apenas letras e forneça nome e sobrenome.")
    private String nome;

    @NotBlank(message = "O CPF é obrigatório.")
    @Pattern(regexp = "^\\d{11}$|^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$", message = "CPF inválido! Deve conter 11 dígitos numéricos.")
    private String cpf;

    @NotBlank(message = "O telefone é obrigatório.")
    @Pattern(regexp = "^\\d{10,11}$", message = "Telefone inválido! Deve conter DD + número (10 ou 11 dígitos).")
    private String telefone;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido!")
    private String email;

    @Valid
    @NotNull(message = "O endereço é obrigatório.")
    private EnderecoDTO endereco;
}