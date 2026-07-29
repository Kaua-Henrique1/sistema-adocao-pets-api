package devKaua.projeto.domain;

public enum Sexo {
    MACHO(1, "Macho"),
    FEMEA(2, "Fêmea");

    private final int valor;
    private final String tipo;

    Sexo(int valor, String tipo) {
        this.valor = valor;
        this.tipo = tipo;
    }

    public int valor() {
        return valor;
    }

    public String tipo() {
        return tipo;
    }

    public static Sexo fromValor(int valor) {
        for (Sexo s : values()) {
            if (s.valor == valor) {
                return s;
            }
        }
        throw new IllegalArgumentException("Sexo inválido: " + valor);
    }
}
