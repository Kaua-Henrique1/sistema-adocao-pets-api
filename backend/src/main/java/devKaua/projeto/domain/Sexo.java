package devKaua.projeto.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Sexo {
    MACHO(1, "Macho"),
    FEMEA(2, "Fêmea");

    private final int valor;
    private final String tipo;

    public static Sexo fromValor(int valor) {
        for (Sexo s : values()) {
            if (s.valor == valor) {
                return s;
            }
        }
        throw new IllegalArgumentException("Sexo inválido: " + valor);
    }
}