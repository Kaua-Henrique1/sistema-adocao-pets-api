package devKaua.projeto.domain;

public enum TipoAnimal {
    CACHORRO(1, "Cachorro"),
    GATO(2, "Gato");

    private final int valor;
    private final String animal;

    TipoAnimal(int valor, String animal) {
        this.animal = animal;
        this.valor = valor;
    }

    public int valor() {
        return valor;
    }

    public String animal() {
        return animal;
    }

    public static TipoAnimal fromValor(int valor) {
        for (TipoAnimal t : values()) {
            if (t.valor == valor) {
                return t;
            }
        }
        throw new IllegalArgumentException("Tipo de animal inválido: " + valor);
    }
}
