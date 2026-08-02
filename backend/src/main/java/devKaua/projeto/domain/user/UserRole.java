package devKaua.projeto.domain.user;

public enum UserRole {
    ADMIN("ROLE_ADMIN"),
    FUNCIONARIO("ROLE_FUNCIONARIO");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}