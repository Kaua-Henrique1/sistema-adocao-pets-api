package devKaua.projeto.repository;

import devKaua.projeto.domain.Adotante;
import devKaua.projeto.domain.Endereco;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class AdotanteRepositoryTest {

    @Autowired
    private AdotanteRepository adotanteRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    @DisplayName("Deve buscar adotante por CPF existente no banco")
    void deveBuscarAdotantePorCpf() {
        Adotante adotante = criarAdotante();
        entityManager.persist(adotante);

        Optional<Adotante> encontrado = adotanteRepository.findByCpf("10120230301");

        assertThat(encontrado).isPresent();
        assertThat(encontrado.get().getCpf()).isEqualTo("10120230301");
        assertThat(encontrado.get().getNome()).isEqualTo("Carlos Eduardo Silva");
        assertThat(encontrado.get().getEndereco().getCidade()).isEqualTo("Natal");
    }

    @Test
    @DisplayName("Deve retornar verdadeiro quando o CPF já estiver cadastrado")
    void deveRetornarVerdadeiroQuandoCpfExistir() {
        Adotante adotante = criarAdotante();
        entityManager.persist(adotante);

        boolean existe = adotanteRepository.existsByCpf("10120230301");
        assertThat(existe).isTrue();
    }

    @Test
    @DisplayName("Deve retornar vazio ao buscar CPF inexistente")
    void deveRetornarVazioQuandoCpfNaoExistir() {
        Optional<Adotante> encontrado = adotanteRepository.findByCpf("00000000000");

        assertThat(encontrado).isEmpty();
    }

    private Adotante criarAdotante() {
        Adotante adotante = new Adotante();
        Endereco endereco = new Endereco();

        endereco.setLogradouro("Av. Roberto Freire");
        endereco.setNumero("1420");
        endereco.setCidade("Natal");

        adotante.setNome("Carlos Eduardo Silva");
        adotante.setCpf("10120230301");
        adotante.setEmail("carlos@email.com");
        adotante.setTelefone("(84) 98811-2233");
        adotante.setEndereco(endereco);

        return adotante;
    }
}