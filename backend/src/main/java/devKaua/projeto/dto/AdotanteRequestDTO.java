package devKaua.projeto.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Requisição para cadastro ou edição de adotante")
public class AdotanteRequestDTO {

    @Schema(
            description = "Nome completo do adotante. Regras: Obrigatório, apenas letras e acentos, exige pelo menos nome e sobrenome.",
            example = "Ana Maria Silva",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "O nome é obrigatório.")
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]+(\\s+[A-Za-zÀ-ÿ]+)+$",
            message = "Nome inválido! Use apenas letras e forneça pelo menos nome e sobrenome."
    )
    private String nome;

    @Schema(
            description = "CPF do adotante. Regras: Obrigatório, aceita 11 dígitos apenas numéricos ou no formato 000.000.000-00.",
            example = "123.456.789-00",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "O CPF é obrigatório.")
    @Pattern(
            regexp = "^\\d{11}$|^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$",
            message = "CPF inválido! Forneça 11 dígitos numéricos ou o formato 000.000.000-00."
    )
    private String cpf;

    @Schema(
            description = "Telefone celular com DDD. Regras: Obrigatório, apenas dígitos numéricos (10 ou 11 dígitos sem espaço ou traço).",
            example = "11987654321",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "O telefone é obrigatório.")
    @Pattern(
            regexp = "^\\d{10,11}$",
            message = "Telefone inválido! Deve conter DDD + número (10 ou 11 dígitos apenas numéricos)."
    )
    private String telefone;

    @Schema(
            description = "E-mail de contato. Regras: Obrigatório, deve seguir o formato padrão válido (ex: usuario@dominio.com).",
            example = "ana.silva@email.com",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido!")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "E-mail inválido! Informe um endereço no formato usuario@dominio.com."
    )
    private String email;

    @Schema(
            description = "Endereço completo do adotante. Regras: Objeto obrigatório com validações internas dos seus campos.",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @Valid
    @NotNull(message = "O endereço é obrigatório.")
    private EnderecoDTO endereco;
}