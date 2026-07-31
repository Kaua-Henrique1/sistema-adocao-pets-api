package devKaua.projeto.service;

import devKaua.projeto.domain.Adotante;
import devKaua.projeto.dto.AdotanteRequestDTO;
import devKaua.projeto.dto.AdotanteResponseDTO;
import devKaua.projeto.exception.BusinessException;
import devKaua.projeto.exception.ResourceNotFoundException;
import devKaua.projeto.mapper.AdotanteMapper;
import devKaua.projeto.mapper.EnderecoMapper;
import devKaua.projeto.repository.AdotanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdotanteService {

    private final AdotanteRepository adotanteRepository;
    private final AdotanteMapper adotanteMapper;
    private final EnderecoMapper enderecoMapper;

    @Transactional
    public AdotanteResponseDTO cadastrar(AdotanteRequestDTO dto) {
        // Remove caracteres não numéricos do CPF para salvar limpo no banco
        String cpfLimpo = dto.getCpf().replaceAll("\\D", "");

        if (adotanteRepository.existsByCpf(cpfLimpo)) {
            throw new BusinessException("Já existe um adotante cadastrado com o CPF: " + dto.getCpf());
        }

        Adotante entity = adotanteMapper.toEntity(dto);
        entity.setCpf(cpfLimpo); // garante o CPF limpo de 11 dígitos

        Adotante salvo = adotanteRepository.save(entity);
        return adotanteMapper.toDTO(salvo);
    }

    @Transactional(readOnly = true)
    public AdotanteResponseDTO buscarPorId(Long id) {
        Adotante adotante = adotanteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adotante não encontrado com o ID: " + id));
        return adotanteMapper.toDTO(adotante);
    }

    @Transactional(readOnly = true)
    public Page<AdotanteResponseDTO> listarTodos(Pageable pageable) {
        return adotanteRepository.findAll(pageable)
                .map(adotanteMapper::toDTO);
    }

    @Transactional
    public AdotanteResponseDTO atualizar(Long id, AdotanteRequestDTO dto) {
        Adotante adotante = adotanteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adotante não encontrado com o ID: " + id));

        adotante.setNome(dto.getNome());
        adotante.setTelefone(dto.getTelefone());
        adotante.setEmail(dto.getEmail());
        adotante.setEndereco(enderecoMapper.toEntity(dto.getEndereco()));

        Adotante atualizado = adotanteRepository.save(adotante);
        return adotanteMapper.toDTO(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        if (!adotanteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Adotante não encontrado com o ID: " + id);
        }
        adotanteRepository.deleteById(id);
    }
}