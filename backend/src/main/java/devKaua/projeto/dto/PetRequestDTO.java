package devKaua.projeto.dto;

import devKaua.projeto.domain.Sexo;
import devKaua.projeto.domain.TipoAnimal;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Requisição para cadastro ou atualização de um Pet")
public class PetRequestDTO {

    @Schema(
            description = "Nome do pet. Regras: Obrigatório, entre 2 e 100 caracteres, aceita apenas letras e espaços.",
            example = "Rex",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "O nome é obrigatório.")
    @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres.")
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]+(\\s+[A-Za-zÀ-ÿ]+)*$",
            message = "Nome inválido! Use apenas letras e espaços (sem números ou símbolos)."
    )
    private String nome;

    @Schema(
            description = "Tipo/Espécie do animal. Regras: Obrigatório. Valores permitidos: CACHORRO ou GATO.",
            example = "CACHORRO",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotNull(message = "O tipo do animal é obrigatório (ex: CACHORRO, GATO).")
    private TipoAnimal tipo;

    @Schema(
            description = "Sexo do pet. Regras: Obrigatório. Valores permitidos: MACHO ou FEMEA.",
            example = "MACHO",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotNull(message = "O sexo é obrigatório (ex: MACHO, FEMEA).")
    private Sexo sexo;

    @Schema(
            description = "Raça do pet. Regras: Obrigatório, máximo 50 caracteres (utilizar 'SRD' para Sem Raça Definida), aceita apenas letras e espaços.",
            example = "Golden Retriever",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "A raça é obrigatória.")
    @Size(max = 50, message = "A raça não pode exceder 50 caracteres.")
    @Pattern(
            regexp = "^[A-Za-zÀ-ÿ]+(\\s+[A-Za-zÀ-ÿ]+)*$",
            message = "Raça inválida! Use apenas letras e espaços (sem números ou símbolos)."
    )
    private String raca;

    @Schema(
            description = "Data de nascimento do pet. Regras: Obrigatório, formato ISO (YYYY-MM-DD), não pode ser uma data futura.",
            example = "2021-05-15",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotNull(message = "A data de nascimento é obrigatória.")
    @PastOrPresent(message = "A data de nascimento não pode ser uma data futura.")
    private LocalDate dataNascimento;

    @Schema(
            description = "Peso do pet em quilos. Regras: Obrigatório, valor decimal entre 0.5 kg e 60.0 kg.",
            example = "12.5",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotNull(message = "O peso é obrigatório.")
    @DecimalMin(value = "0.5", message = "Peso inválido! Mínimo de 0.5 kg.")
    @DecimalMax(value = "60.0", message = "Peso inválido! Máximo de 60 kg.")
    private Double peso;

    @Schema(
            description = "Endereço onde o pet foi encontrado. Regras: Objeto obrigatório composto por logradouro, numero e cidade.",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @Valid
    @NotNull(message = "O endereço é obrigatório.")
    private EnderecoDTO endereco;
}