package devKaua.projeto.repository;

import devKaua.projeto.domain.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    // Buscar pets disponíveis para adoção (onde tutor/id_tutor é NULO)
    List<Pet> findByTutorIsNull();

    // Buscar todos os pets vinculados a um tutor específico
    List<Pet> findByTutorId(Long tutorId);

    // Consulta customizada paginada por cidade do abrigo/pet
    Page<Pet> findByEnderecoCidadeIgnoreCase(String cidade, Pageable pageable);

    // Consulta inteligente por fragmento do nome do pet (usando o índice do banco)
    @Query("SELECT p FROM Pet p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))")
    List<Pet> buscarPorNomeAproximado(@Param("nome") String nome);
}