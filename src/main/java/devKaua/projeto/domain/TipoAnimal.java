package devKaua.projeto.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TipoAnimal {
    CACHORRO(1, "Cachorro"),
    GATO(2, "Gato");

    private final int valor;
    private final String animal;

    public static TipoAnimal fromValor(int valor) {
        for (TipoAnimal t : values()) {
            if (t.valor == valor) {
                return t;
            }
        }
        throw new IllegalArgumentException("Tipo de animal inválido: " + valor);
    }
}