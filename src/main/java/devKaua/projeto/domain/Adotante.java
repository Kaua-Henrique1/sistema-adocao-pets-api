package devKaua.projeto.domain;

import devKaua.projeto.application.PetService;

import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Pattern;

public class Pessoa {

    public static final String SEM_DADOS = "SEM DADOS";
    private static final AtomicLong idGenerator = new AtomicLong(1);

    private Long id;
    private String nome;
    private String cpf;
    private String telefone;
    private String email;
    private Endereco endereco;

    // Construtor completo (usado ao carregar dados existentes, ex: TXT/Banco)
    public Pessoa(Long id, String nome, String cpf, String telefone, String email, Endereco endereco) {
        this.id = id;
        this.nome = (nome != null && !nome.isBlank()) ? nome : SEM_DADOS;
        this.cpf = (cpf != null && !cpf.isBlank()) ? cpf : SEM_DADOS;
        this.telefone = (telefone != null && !telefone.isBlank()) ? telefone : SEM_DADOS;
        this.email = (email != null && !email.isBlank()) ? email : SEM_DADOS;
        this.endereco = (endereco != null) ? endereco : new Endereco(SEM_DADOS, SEM_DADOS, SEM_DADOS);
    }

    public static Pessoa criar(String nome, String cpf, String telefone, String email, Endereco endereco) {
        Long novoId = idGenerator.getAndIncrement();
        return new Pessoa(novoId, nome, cpf, telefone, email, endereco);
    }

    public boolean isTutor(PetService petService) {
        if (petService == null || this.id == null) {
            return false;
        }
        return petService.obterListaDeObjetosPets().stream()
                .anyMatch(pet -> Objects.equals(pet.getTutorId(), this.id));
    }

    public void alterarNome(String novoNome) {
        if (novoNome != null && !novoNome.isBlank()) {
            this.setNome(novoNome);
        }
    }

    public void alterarTelefone(String novoTelefone) {
        if (novoTelefone != null && !novoTelefone.isBlank()) {
            this.setTelefone(novoTelefone);
        }
    }

    public void alterarEmail(String novoEmail) {
        if (novoEmail != null && !novoEmail.isBlank()) {
            this.setEmail(novoEmail);
        }
    }

    public static void atualizarGerador(Long maiorIdEncontrado) {
        if (maiorIdEncontrado != null && maiorIdEncontrado >= idGenerator.get()) {
            idGenerator.set(maiorIdEncontrado + 1);
        }
    }

    private void setNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        // Aceita letras de A-Z (incluindo acentos) e espaços
        String regexNome = "^[A-Za-zÀ-ÿ]+(\\s+[A-Za-zÀ-ÿ]+)+ *$";
        if (!nome.matches(regexNome)) {
            throw new IllegalArgumentException("Nome inválido! Use apenas letras e sobrenome separado por espaço.");
        }
        this.nome = nome.trim();
    }

    private void setCpf(String cpf) {
        if (cpf == null || cpf.trim().isEmpty()) {
            throw new IllegalArgumentException("CPF é obrigatório.");
        }
        String cpfLimpo = cpf.replaceAll("\\D", "");
        if (cpfLimpo.length() != 11) {
            throw new IllegalArgumentException("CPF inválido! Deve conter exatamente 11 dígitos numéricos.");
        }
        this.cpf = cpfLimpo;
    }

    private void setTelefone(String telefone) {
        if (telefone == null || telefone.trim().isEmpty()) {
            this.telefone = SEM_DADOS;
            return;
        }
        String apenasNumeros = telefone.replaceAll("\\D", "");
        if (apenasNumeros.length() < 10 || apenasNumeros.length() > 11) {
            throw new IllegalArgumentException("Telefone inválido! Deve conter DD + número (10 ou 11 dígitos apenas numéricos).");
        }
        this.telefone = apenasNumeros;
    }

    private void setEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }
        // Padrão RFC 5322 para e-mails válidos
        String regexEmail = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        Pattern pattern = Pattern.compile(regexEmail);
        if (!pattern.matcher(email).matches()) {
            throw new IllegalArgumentException("E-mail inválido! Informe um formato correto (exemplo@dominio.com).");
        }
        this.email = email.trim().toLowerCase();
    }


    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getEmail() {
        return email;
    }

    public Endereco getEndereco() {
        return endereco;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pessoa pessoa = (Pessoa) o;
        return Objects.equals(id, pessoa.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Pessoa{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", cpf='" + cpf + '\'' +
                ", telefone='" + telefone + '\'' +
                ", email='" + email + '\'' +
                ", endereco=" + endereco +
                '}';
    }
}