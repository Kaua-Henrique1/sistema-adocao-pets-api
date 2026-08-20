package devKaua.projeto.service;

import devKaua.projeto.domain.Adotante;
import devKaua.projeto.domain.Endereco;
import devKaua.projeto.domain.Pet;
import devKaua.projeto.dto.EnderecoDTO;
import devKaua.projeto.dto.PetRequestDTO;
import devKaua.projeto.dto.PetResponseDTO;
import devKaua.projeto.exception.BusinessException;
import devKaua.projeto.exception.ResourceNotFoundException;
import devKaua.projeto.mapper.EnderecoMapper;
import devKaua.projeto.mapper.PetMapper;
import devKaua.projeto.repository.AdotanteRepository;
import devKaua.projeto.repository.PetRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetRepository petRepository;

    @Mock
    private AdotanteRepository adotanteRepository;

    @Mock
    private PetMapper petMapper;

    @Mock
    private EnderecoMapper enderecoMapper;

    @InjectMocks
    private PetService petService;

    @Nested
    @DisplayName("Testes do Fluxo de Adoção (adotarPet)")
    class AdotarPet {

        @Test
        @DisplayName("Sucesso: Deve vincular o pet ao adotante quando ambos existirem e o pet estiver disponível")
        void deveAdotarPetComSucesso() {
            Long petId = 1L;
            Long adotanteId = 10L;

            Pet pet = new Pet();
            Adotante adotante = new Adotante();
            Pet petSalvo = new Pet();
            PetResponseDTO responseDTO = PetResponseDTO.builder().id(petId).build();

            when(petRepository.findById(petId)).thenReturn(Optional.of(pet));
            when(adotanteRepository.findById(adotanteId)).thenReturn(Optional.of(adotante));
            when(petRepository.save(pet)).thenReturn(petSalvo);
            when(petMapper.toDTO(petSalvo)).thenReturn(responseDTO);

            PetResponseDTO resultado = petService.adotarPet(petId, adotanteId);

            assertThat(resultado).isNotNull();
            assertThat(pet.getTutor()).isEqualTo(adotante);
            verify(petRepository).save(pet);
        }

        @Test
        @DisplayName("Exceção: Deve lançar ResourceNotFoundException quando o Pet não for encontrado")
        void deveLancarExcecaoQuandoPetNaoExistir() {
            when(petRepository.findById(1L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> petService.adotarPet(1L, 10L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Pet não encontrado");

            verify(petRepository, never()).save(any());
        }

        @Test
        @DisplayName("Exceção: Deve lançar BusinessException quando o Pet já possuir um tutor")
        void deveLancarExcecaoQuandoPetJaTiverTutor() {
            Long petId = 1L;
            Pet petComTutor = new Pet();
            petComTutor.setTutor(new Adotante());

            when(petRepository.findById(petId)).thenReturn(Optional.of(petComTutor));

            assertThatThrownBy(() -> petService.adotarPet(petId, 10L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessageContaining("Este pet já possui um tutor/adotante");

            verify(adotanteRepository, never()).findById(any());
            verify(petRepository, never()).save(any());
        }

        @Test
        @DisplayName("Exceção: Deve lançar ResourceNotFoundException quando o Adotante não for encontrado")
        void deveLancarExcecaoQuandoAdotanteNaoExistir() {
            Long petId = 1L;
            Long adotanteId = 99L;
            Pet petSemTutor = new Pet();

            when(petRepository.findById(petId)).thenReturn(Optional.of(petSemTutor));
            when(adotanteRepository.findById(adotanteId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> petService.adotarPet(petId, adotanteId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Adotante não encontrado");

            verify(petRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Testes de Listagem de Pets Disponíveis")
    class ListarDisponiveis {

        @Test
        @DisplayName("Sucesso: Deve retornar página de pets sem tutor")
        void deveListarPetsDisponiveis() {
            Pet pet = new Pet();
            PetResponseDTO dto = PetResponseDTO.builder().build();
            Pageable pageable = PageRequest.of(0, 10);
            Page<Pet> pagePets = new PageImpl<>(List.of(pet));

            when(petRepository.findByTutorIsNull(pageable)).thenReturn(pagePets);
            when(petMapper.toDTO(pet)).thenReturn(dto);

            Page<PetResponseDTO> resultado = petService.listarDisponiveis(pageable);

            assertThat(resultado.getContent()).hasSize(1);
            verify(petRepository).findByTutorIsNull(pageable);
        }
    }

    @Nested
    @DisplayName("Testes de Atualização e Remoção de Pet")
    class AtualizarERemover {

        @Test
        @DisplayName("Sucesso: Deve atualizar os dados do pet com sucesso")
        void deveAtualizarPetComSucesso() {
            Long petId = 1L;
            LocalDate dataNascimentoAntiga = LocalDate.of(2020, 1, 1);
            LocalDate dataNascimentoNova = LocalDate.of(2021, 5, 10);

            Pet petExistente = new Pet();
            petExistente.setNome("Nome Antigo");
            petExistente.setRaca("Vira-Lata");
            petExistente.setDataNascimento(dataNascimentoAntiga);
            petExistente.setPeso(5.0);

            EnderecoDTO enderecoDTO = EnderecoDTO.builder()
                    .logradouro("Rua Nova")
                    .numero("123")
                    .cidade("Natal")
                    .build();

            Endereco enderecoEntity = Endereco.builder()
                    .logradouro("Rua Nova")
                    .numero("123")
                    .cidade("Natal")
                    .build();

            PetRequestDTO requestDTO = PetRequestDTO.builder()
                    .nome("Nome Novo")
                    .raca("Siames")
                    .dataNascimento(dataNascimentoNova)
                    .peso(7.5)
                    .endereco(enderecoDTO)
                    .build();

            Pet petAtualizado = new Pet();
            PetResponseDTO responseDTO = PetResponseDTO.builder().build();

            when(petRepository.findById(petId)).thenReturn(Optional.of(petExistente));
            when(enderecoMapper.toEntity(enderecoDTO)).thenReturn(enderecoEntity);
            when(petRepository.save(petExistente)).thenReturn(petAtualizado);
            when(petMapper.toDTO(petAtualizado)).thenReturn(responseDTO);

            PetResponseDTO resultado = petService.atualizar(petId, requestDTO);

            assertThat(resultado).isNotNull();
            assertThat(petExistente.getNome()).isEqualTo("Nome Novo");
            assertThat(petExistente.getRaca()).isEqualTo("Siames");
            assertThat(petExistente.getDataNascimento()).isEqualTo(dataNascimentoNova);
            assertThat(petExistente.getPeso()).isEqualTo(7.5);
            assertThat(petExistente.getEndereco()).isEqualTo(enderecoEntity);

            verify(petRepository).save(petExistente);
        }

        @Test
        @DisplayName("Sucesso: Deve remover pet existente")
        void deveRemoverPetComSucesso() {
            Long petId = 1L;

            when(petRepository.existsById(petId)).thenReturn(true);

            petService.remover(petId);

            verify(petRepository).deleteById(petId);
        }

        @Test
        @DisplayName("Exceção: Deve lançar erro ao tentar remover pet inexistente")
        void deveLancarExcecaoAoRemoverPetInexistente() {
            Long petId = 99L;

            when(petRepository.existsById(petId)).thenReturn(false);

            assertThatThrownBy(() -> petService.remover(petId))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Pet não encontrado");

            verify(petRepository, never()).deleteById(any());
        }
    }
}