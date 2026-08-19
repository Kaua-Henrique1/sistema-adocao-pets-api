package devKaua.projeto.repository;

import devKaua.projeto.domain.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class PetRepositoryTest {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private TestEntityManager entityManager;


    @Test
    @DisplayName("Sucesso: Deve retornar pets que não possuem tutor (disponíveis)")
    void deveRetornarPetsDisponiveisSemTutor() {
        Pet petDisponivel = criarPet("Bolinha", "Natal");
        entityManager.persist(petDisponivel);

        Page<Pet> paginaEncontrada = petRepository.findByTutorIsNull(PageRequest.of(0, 10));

        assertThat(paginaEncontrada.getContent()).isNotEmpty();
        assertThat(paginaEncontrada.getContent().get(0).getNome()).isEqualTo("Bolinha");
    }

    @Test
    @DisplayName("Vazio: Não deve retornar pets que já possuem tutor")
    void naoDeveRetornarPetsQueJaPossuemTutor() {
        Adotante tutor = criarAdotante();
        entityManager.persist(tutor);

        Pet petAdotado = criarPet("Rex", "Natal");
        petAdotado.setTutor(tutor); // Vinculando ao tutor
        entityManager.persist(petAdotado);

        Page<Pet> paginaEncontrada = petRepository.findByTutorIsNull(PageRequest.of(0, 10));

        assertThat(paginaEncontrada.getContent()).isEmpty();
    }

    // --- TESTES PARA: findByTutorId(Long tutorId) ---

    @Test
    @DisplayName("Sucesso: Deve retornar todos os pets de um tutor específico")
    void deveRetornarPetsDoTutorEspecifico() {
        Adotante tutor = criarAdotante();
        entityManager.persist(tutor);

        Pet pet1 = criarPet("Rex", "Natal");
        pet1.setTutor(tutor);
        entityManager.persist(pet1);

        Pet pet2 = criarPet("Mia", "Natal");
        pet2.setTutor(tutor);
        entityManager.persist(pet2);

        List<Pet> encontrados = petRepository.findByTutorId(tutor.getId());

        assertThat(encontrados).hasSize(2);
        assertThat(encontrados).extracting(Pet::getNome).containsExactlyInAnyOrder("Rex", "Mia");
    }

    @Test
    @DisplayName("Vazio: Deve retornar lista vazia se o tutor não tiver pets")
    void deveRetornarVazioQuandoTutorNaoTiverPets() {
        Adotante tutor = criarAdotante();
        entityManager.persist(tutor);

        List<Pet> encontrados = petRepository.findByTutorId(tutor.getId());

        assertThat(encontrados).isEmpty();
    }

    // --- TESTES PARA: findByEnderecoCidadeIgnoreCase() ---

    @Test
    @DisplayName("Sucesso: Deve encontrar pet pela cidade ignorando maiúsculas/minúsculas")
    void deveRetornarPetPorCidadeIgnorandoCaixa() {
        Pet pet = criarPet("Caramelo", "SÃO PAULO");
        entityManager.persist(pet);

        Page<Pet> paginaEncontrada = petRepository.findByEnderecoCidadeIgnoreCase("são paulo", PageRequest.of(0, 10));

        assertThat(paginaEncontrada.getContent()).isNotEmpty();
        assertThat(paginaEncontrada.getContent().get(0).getNome()).isEqualTo("Caramelo");
    }

    @Test
    @DisplayName("Vazio: Não deve encontrar pet se a cidade for diferente")
    void naoDeveEncontrarPetSeCidadeDiferente() {
        Pet pet = criarPet("Caramelo", "Natal");
        entityManager.persist(pet);

        Page<Pet> paginaEncontrada = petRepository.findByEnderecoCidadeIgnoreCase("Recife", PageRequest.of(0, 10));

        assertThat(paginaEncontrada.getContent()).isEmpty();
    }

    // --- TESTES PARA: buscarPorNomeAproximado() ---

    @Test
    @DisplayName("Sucesso: Deve encontrar pet por um trecho do nome (LIKE %nome%)")
    void deveEncontrarPetPorTrechoDoNome() {
        Pet pet1 = criarPet("Frederico", "Natal");
        Pet pet2 = criarPet("Fred", "Natal");
        entityManager.persist(pet1);
        entityManager.persist(pet2);

        List<Pet> encontrados = petRepository.buscarPorNomeAproximado("fred");

        assertThat(encontrados).hasSize(2);
        assertThat(encontrados).extracting(Pet::getNome).containsExactlyInAnyOrder("Frederico", "Fred");
    }

    @Test
    @DisplayName("Vazio: Não deve encontrar pet quando o nome for incompatível")
    void naoDeveEncontrarPetPorTrechoDoNomeIncompativel() {
        Pet pet = criarPet("Bolinha", "Natal");
        entityManager.persist(pet);

        List<Pet> encontrados = petRepository.buscarPorNomeAproximado("Fred");

        assertThat(encontrados).isEmpty();
    }

    // --- MÉTODOS AUXILIARES ---

    private Pet criarPet(String nome, String cidade) {
        Pet pet = new Pet();
        pet.setNome(nome);

        pet.setTipo(TipoAnimal.CACHORRO);
        pet.setSexo(Sexo.MACHO);
        pet.setRaca("SRD (Sem Raça Definida)");
        pet.setIdade(2.5);
        pet.setPeso(12.0);
        pet.setCreatedAt(java.time.LocalDateTime.now());

        Endereco endereco = new Endereco();
        endereco.setCidade(cidade);
        endereco.setLogradouro("Rua dos Pets");
        endereco.setNumero("10");

        pet.setEndereco(endereco);

        return pet;
    }

    private Adotante criarAdotante() {
        Adotante adotante = new Adotante();
        adotante.setNome("João Silva");
        adotante.setCpf("12345678901");
        adotante.setEmail("joao@email.com");
        adotante.setTelefone("999999999");

        Endereco endereco = new Endereco();
        endereco.setCidade("Natal");
        endereco.setLogradouro("Rua X");
        endereco.setNumero("100");
        adotante.setEndereco(endereco);

        return adotante;
    }
}