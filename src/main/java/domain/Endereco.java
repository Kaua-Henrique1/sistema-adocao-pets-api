package domain;

public class Endereco {

    private static final String SEM_DADOS = "NÃO INFORMADO";

    private final String rua;
    private final String numero;
    private final String cidade;

    public Endereco(String rua, String numero, String cidade) {
        if (rua == null || rua.isBlank()) {
            throw new IllegalArgumentException("Rua é obrigatória.");
        }
        if (cidade == null || cidade.isBlank()) {
            throw new IllegalArgumentException("Cidade é obrigatória.");
        }
        this.rua = rua;
        this.cidade = cidade;
        this.numero = (numero == null || numero.isEmpty()) ? SEM_DADOS : numero;
    }

    @Override
    public String toString() {
        return getRua() + ", " + getNumero() + " - " + getCidade();
    }

    public String toFormatado() {
        return getRua() + ", " + getNumero() + ", " + getCidade();
    }

    public String getRua() {
        return rua;
    }

    public String getNumero() {
        return numero;
    }

    public String getCidade() {
        return cidade;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Endereco endereco = (Endereco) o;
        return rua.equals(endereco.rua)
                && numero.equals(endereco.numero)
                && cidade.equals(endereco.cidade);
    }

    @Override
    public int hashCode() {
        int result = rua.hashCode();
        result = 31 * result + numero.hashCode();
        result = 31 * result + cidade.hashCode();
        return result;
    }
}
