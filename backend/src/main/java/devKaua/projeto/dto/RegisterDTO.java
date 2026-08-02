package devKaua.projeto.dto;

import devKaua.projeto.domain.user.UserRole;

public record RegisterDTO(String login, String senha, UserRole role) {
}