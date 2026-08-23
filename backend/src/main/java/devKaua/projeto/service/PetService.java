package devKaua.projeto.service;

import devKaua.projeto.domain.Adotante;
import devKaua.projeto.domain.Endereco;
import devKaua.projeto.domain.Pet;
import devKaua.projeto.dto.PetRequestDTO;
import devKaua.projeto.dto.PetResponseDTO;
import devKaua.projeto.exception.BusinessException;
import devKaua.projeto.exception.ResourceNotFoundException;
import devKaua.projeto.mapper.EnderecoMapper;
import devKaua.projeto.mapper.PetMapper;
import devKaua.projeto.repository.AdotanteRepository;
import devKaua.projeto.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final AdotanteRepository adotanteRepository;
    private final PetMapper petMapper;
    private final EnderecoMapper enderecoMapper;

    @Transactional
    public PetResponseDTO cadastrar(PetRequestDTO dto) {
        Pet pet = petMapper.toEntity(dto);
        Pet salvo = petRepository.save(pet);
        return petMapper.toDTO(salvo);
    }

    @Transactional(readOnly = true)
    public PetResponseDTO buscarPorId(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado com o ID: " + id));
        return petMapper.toDTO(pet);
    }

    @Transactional(readOnly = true)
    public Page<PetResponseDTO> listarDisponiveis(Pageable pageable) {
        return petRepository.findByTutorIsNull(pageable)
                .map(petMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<PetResponseDTO> listarPorCidade(String cidade, Pageable pageable) {
        return petRepository.findByEnderecoCidadeContainingIgnoreCase(cidade, pageable)
                .map(petMapper::toDTO);
    }

    @Transactional
    public PetResponseDTO adotarPet(Long petId, Long adotanteId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado com o ID: " + petId));

        if (pet.getTutor() != null) {
            throw new BusinessException("Este pet já possui um tutor/adotante e não está disponível para adoção!");
        }

        Adotante adotante = adotanteRepository.findById(adotanteId)
                .orElseThrow(() -> new ResourceNotFoundException("Adotante não encontrado com o ID: " + adotanteId));

        pet.setTutor(adotante);

        Pet petAdotado = petRepository.save(pet);
        return petMapper.toDTO(petAdotado);
    }

    @Transactional
    public PetResponseDTO atualizar(Long id, PetRequestDTO dto) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado com o ID: " + id));

        pet.setNome(dto.getNome());
        pet.setRaca(dto.getRaca());
        pet.setDataNascimento(dto.getDataNascimento());
        pet.setPeso(dto.getPeso());

        if (dto.getEndereco() != null) {
            Endereco enderecoAtualizado = enderecoMapper.toEntity(dto.getEndereco());
            pet.setEndereco(enderecoAtualizado);
        }

        Pet petAtualizado = petRepository.save(pet);
        return petMapper.toDTO(petAtualizado);
    }

    @Transactional
    public void remover(Long id) {
        if (!petRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet não encontrado com o ID: " + id);
        }
        petRepository.deleteById(id);
    }
}