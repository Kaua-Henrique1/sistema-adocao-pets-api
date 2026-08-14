package devKaua.projeto.service;

import devKaua.projeto.domain.Adotante;
import devKaua.projeto.dto.AdotanteRequestDTO;
import devKaua.projeto.dto.AdotanteResponseDTO;
import devKaua.projeto.exception.BusinessException;
import devKaua.projeto.exception.ResourceNotFoundException;
import devKaua.projeto.mapper.AdotanteMapper;
import devKaua.projeto.mapper.EnderecoMapper;
import devKaua.projeto.repository.AdotanteRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdotanteServiceTest {

    @Mock
    private AdotanteRepository adotanteRepository;

    @Mock
    private AdotanteMapper adotanteMapper;

    @Mock
    private EnderecoMapper enderecoMapper;

    @InjectMocks
    private AdotanteService adotanteService;

    @Nested
    @DisplayName("Testes de Cadastro")
    class Cadastrar {

        @Test
        @DisplayName("Sucesso: Deve cadastrar adotante e limpar formatação do CPF")
        void deveCadastrarAdotanteComSucesso() {
            AdotanteRequestDTO requestDTO = new AdotanteRequestDTO();
            requestDTO.setCpf("123.456.789-00"); // CPF formatado

            Adotante entity = new Adotante();
            Adotante salvo = new Adotante();
            AdotanteResponseDTO responseDTO = new AdotanteResponseDTO();

            when(adotanteRepository.existsByCpf("12345678900")).thenReturn(false);
            when(adotanteMapper.toEntity(requestDTO)).thenReturn(entity);
            when(adotanteRepository.save(entity)).thenReturn(salvo);
            when(adotanteMapper.toDTO(salvo)).thenReturn(responseDTO);

            AdotanteResponseDTO resultado = adotanteService.cadastrar(requestDTO);

            assertThat(resultado).isNotNull();
            assertThat(entity.getCpf()).isEqualTo("12345678900"); // Garante que o CPF foi limpo
            verify(adotanteRepository).save(entity);
        }

        @Test
        @DisplayName("Exceção: Deve lançar BusinessException quando CPF já existir")
        void deveLancarExcecaoQuandoCpfJaExistir() {
            AdotanteRequestDTO requestDTO = new AdotanteRequestDTO();
            requestDTO.setCpf("123.456.789-00");

            when(adotanteRepository.existsByCpf("12345678900")).thenReturn(true);

            assertThatThrownBy(() -> adotanteService.cadastrar(requestDTO))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("Já existe um adotante cadastrado com o CPF");

            verify(adotanteRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Testes de Busca por ID")
    class BuscarPorId {

        @Test
        @DisplayName("Sucesso: Deve retornar adotante quando ID existir")
        void deveBuscarPorIdComSucesso() {
            Long id = 1L;
            Adotante adotante = new Adotante();
            AdotanteResponseDTO responseDTO = new AdotanteResponseDTO();

            when(adotanteRepository.findById(id)).thenReturn(Optional.of(adotante));
            when(adotanteMapper.toDTO(adotante)).thenReturn(responseDTO);

            AdotanteResponseDTO resultado = adotanteService.buscarPorId(id);

            assertThat(resultado).isNotNull();
        }

        @Test
        @DisplayName("Exceção: Deve lançar ResourceNotFoundException quando ID não existir")
        void deveLancarExcecaoQuandoIdNaoEncontrado() {
            Long id = 99L;
            when(adotanteRepository.findById(id)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> adotanteService.buscarPorId(id))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Adotante não encontrado com o ID: " + id);
        }
    }

    @Nested
    @DisplayName("Testes de Deleção")
    class Deletar {

        @Test
        @DisplayName("Sucesso: Deve deletar quando o ID existir")
        void deveDeletarComSucesso() {
            Long id = 1L;
            when(adotanteRepository.existsById(id)).thenReturn(true);

            adotanteService.deletar(id);

            verify(adotanteRepository).deleteById(id);
        }

        @Test
        @DisplayName("Exceção: Deve lançar ResourceNotFoundException ao tentar deletar ID inexistente")
        void deveLancarExcecaoAoDeletarInexistente() {
            Long id = 99L;
            when(adotanteRepository.existsById(id)).thenReturn(false);

            assertThatThrownBy(() -> adotanteService.deletar(id))
                    .isInstanceOf(ResourceNotFoundException.class);

            verify(adotanteRepository, never()).deleteById(any());
        }
    }
}