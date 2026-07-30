package devKaua.projeto.mapper;

import devKaua.projeto.domain.Endereco;
import devKaua.projeto.dto.EnderecoDTO;
import org.springframework.stereotype.Component;


@Component
public class EnderecoMapper {

    public Endereco toEntity(EnderecoDTO dto) {
        if (dto == null) {
            return null;
        }
        return Endereco.builder()
                .logradouro(dto.getLogradouro())
                .numero(dto.getNumero())
                .cidade(dto.getCidade())
                .build();
    }

    public EnderecoDTO toDTO(Endereco entity) {
        if (entity == null) {
            return null;
        }
        return EnderecoDTO.builder()
                .logradouro(entity.getLogradouro())
                .numero(entity.getNumero())
                .cidade(entity.getCidade())
                .build();
    }
}