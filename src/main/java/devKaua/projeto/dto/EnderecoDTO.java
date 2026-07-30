package devKaua.projeto.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
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
@Schema(description = "DTO representando o endereço do adotante ou local do Pet encontrado")
public class EnderecoDTO {

    @Schema(
            description = "Nome do logradouro (rua, avenida, etc.). Regras: Obrigatório, aceita apenas letras e acentos (sem números).",
            example = "Manoel Fernandes Neto",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "O logradouro é obrigatório.")
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ\\s.,'-]+$",
            message = "Logradouro inválido! Use apenas letras e acentos (números não são permitidos)."
    )
    private String logradouro;

    @Schema(
            description = "Número da residência ou identificação do imóvel. Regras: Obrigatório (utilizar números ou 'S/N').",
            example = "1000",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "O número é obrigatório.")
    @Pattern(
            regexp = "^(?i)(S/N|\\d+[A-Za-z]?)$",
            message = "Número inválido! Informe o número do imóvel (ex: 1000, 100A) ou 'S/N'."
    )
    private String numero;

    @Schema(
            description = "Nome da cidade. Regras: Obrigatório, aceita apenas letras e acentos (sem números).",
            example = "Parnamirim",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "A cidade é obrigatória.")
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ\\s'-]+$",
            message = "Cidade inválida! Use apenas letras e acentos (números não são permitidos)."
    )
    private String cidade;
}