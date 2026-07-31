package devKaua.projeto.repository;

import devKaua.projeto.domain.Adotante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdotanteRepository extends JpaRepository<Adotante, Long> {

    Optional<Adotante> findByCpf(String cpf);

    boolean existsByCpf(String cpf);
}