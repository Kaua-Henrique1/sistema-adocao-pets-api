package domain;

import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Pet {

    private static final AtomicLong idGenerator = new AtomicLong(1);

    public static final String SEM_DADOS = "NÃO INFORMADO";

    private final Long id;
    private String nome;
    private final Endereco endereco;
    private final Sexo sexo;
    private final TipoAnimal tipoAnimal;
    private String idade;
    private String peso;
    private String raca;
    private Long tutorId; // 🔄 NOVO ATRIBUTO: Guarda o ID do Adotante que virou Tutor

    // --- Construtor para Reconstituição COMPLETA (Lendo do TXT com Tutor) ---
    public Pet(Long id, String nome, Endereco endereco, Sexo sexo,
               TipoAnimal tipoAnimal, String idade, String peso, String raca, Long tutorId) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório para reconstitution.");
        }
        this.id = id;
        setNome(nome);
        setIdade(idade);
        setPeso(peso);
        setRaca(raca);
        this.endereco = endereco;
        this.sexo = sexo;
        this.tipoAnimal = tipoAnimal;
        this.tutorId = tutorId; // Restaura o vínculo salvo
    }

    // --- Construtor antigo mantido para retrocompatibilidade se necessário ---
    public Pet(Long id, String nome, Endereco endereco, Sexo sexo,
               TipoAnimal tipoAnimal, String idade, String peso, String raca) {
        this(id, nome, endereco, sexo, tipoAnimal, idade, peso, raca, null);
    }

    // --- Construtor privado para o Factory Method ---
    private Pet(String nome, Endereco endereco, Sexo sexo,
                TipoAnimal tipoAnimal, String idade, String peso, String raca) {
        this.id = idGenerator.getAndIncrement();
        setNome(nome);
        setIdade(idade);
        setPeso(peso);
        setRaca(raca);
        this.endereco = endereco;
        this.sexo = sexo;
        this.tipoAnimal = tipoAnimal;
        this.tutorId = null;
    }

    public void vincularTutor(Long idAdotante) {
        if (idAdotante == null || idAdotante <= 0) {
            throw new IllegalArgumentException("ID do tutor inválido para vinculação.");
        }
        this.tutorId = idAdotante;
    }

    public static Pet criar(String nome, Endereco endereco, Sexo sexo,
                            TipoAnimal tipoAnimal, String idade, String peso, String raca) {
        return new Pet(nome, endereco, sexo, tipoAnimal, idade, peso, raca);
    }

    public void alterarNome(String nome) {
        setNome(nome);
    }

    public void alterarIdade(String idade) {
        setIdade(idade);
    }

    public void alterarPeso(String peso) {
        setPeso(peso);
    }

    public void alterarRaca(String raca) {
        setRaca(raca);
    }

    private void setNome(String nome) {
        if (nome == null || nome.isEmpty()) {
            this.nome = SEM_DADOS;
            return;
        }
        String regexNome = "[A-Za-z]+(\\s)+[A-Za-z]+(\\s+|$)";
        Pattern regraNome = Pattern.compile(regexNome);
        Matcher condicionalNome = regraNome.matcher(nome);
        if (!condicionalNome.find()) {
            throw new IllegalArgumentException("Nome inválido! Use apenas letras e espaço.");
        }
        this.nome = nome;
    }

    private void setIdade(String idade) {
        if (idade == null || idade.isEmpty()) {
            this.idade = SEM_DADOS;
            return;
        }
        String regexIdadePeso = "[0-9]+((\\\\.|,)[0-9]+)?";
        Pattern regraIdadePeso = Pattern.compile(regexIdadePeso);
        Matcher condicionalIdade = regraIdadePeso.matcher(idade);
        if (Double.parseDouble(idade) > 60 || !condicionalIdade.find()) {
            throw new IllegalArgumentException("Idade inválida! Escreva apenas números entre 0.1 Anos até 60 anos.");
        }
        this.idade = idade;
    }

    private void setPeso(String peso) {
        if (peso == null || peso.isEmpty()) {
            this.peso = SEM_DADOS;
            return;
        }
        String pesoPet = peso.replace(',', '.');
        String regexPeso = "[0-9]+((\\\\.|,)[0-9]+)?";
        Pattern regraPeso = Pattern.compile(regexPeso);
        Matcher condicionalPeso = regraPeso.matcher(pesoPet);
        if (Double.parseDouble(pesoPet) > 60 || Double.parseDouble(pesoPet) < 0.5 || !condicionalPeso.find()) {
            throw new IllegalArgumentException("Peso inválido! Escreva apenas números entre 0.5kl até 60kl.");
        }
        this.peso = peso;
    }

    private void setRaca(String raca) {
        if (raca == null || raca.isEmpty()) {
            this.raca = SEM_DADOS;
            return;
        }
        String regexRaca = "[a-z,A-Z]+";
        Pattern regraRaca = Pattern.compile(regexRaca);
        Matcher condicionalRaca = regraRaca.matcher(raca);
        if (!condicionalRaca.find()) {
            throw new IllegalArgumentException("Raça inválida! Escreva apenas letras.");
        }
        this.raca = raca;
    }

    public Long getID() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    public Sexo getSexo() {
        return sexo;
    }

    public TipoAnimal getTipoAnimal() {
        return tipoAnimal;
    }

    public String getIdade() {
        return idade;
    }

    public String getPeso() {
        return peso;
    }

    public String getRaca() {
        return raca;
    }

    public Long getTutorId() {
        return tutorId;
    }

    public void desvincularTutor() {
        this.tutorId = null;
    }

    public static void atualizarGerador(Long maiorIdEncontrado) {
        if (maiorIdEncontrado >= idGenerator.get()) {
            idGenerator.set(maiorIdEncontrado + 1);
        }
    }

    @Override
    public String toString() {
        return ". " + getID() + " - " + getNome() + " - " + getEndereco().toString()
                + " - " + getTipoAnimal() + " - " + getSexo() + " - " + getIdade()
                + " anos - " + getPeso() + "kg - " + getRaca() +  " - " + getTutorId();
    }
}
