-- 1. TABELA DE ADOTANTES
CREATE TABLE adotantes
(
    id         BIGSERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    cpf        VARCHAR(14)  NOT NULL UNIQUE,
    telefone   VARCHAR(20)  NOT NULL,
    email      VARCHAR(100) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero     VARCHAR(20)  NOT NULL,
    cidade     VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

-- Índices para otimização de busca rápida em memória/consultas
CREATE INDEX idx_adotantes_cpf ON adotantes (cpf);
CREATE INDEX idx_adotantes_nome ON adotantes (nome);


-- 2. TABELA DE PETS
CREATE TABLE pets
(
    id         BIGSERIAL PRIMARY KEY,
    nome       VARCHAR(100) NOT NULL,
    tipo       VARCHAR(30)  NOT NULL,
    sexo       VARCHAR(10)  NOT NULL,
    raca       VARCHAR(50)  NOT NULL,
    idade      VARCHAR(20)  NOT NULL,
    peso       VARCHAR(20)  NOT NULL,
    id_tutor   BIGINT,
    logradouro VARCHAR(150) NOT NULL, -- Endereço do local de acolhimento do pet
    numero     VARCHAR(20)  NOT NULL,
    cidade     VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,

    -- CONSTRAINT DE CHAVE ESTRANGEIRA (FK)
    -- Se id_tutor IS NULL  -> Pet está disponível para adoção
    -- Se id_tutor IS NOT NULL -> Pet possui um Tutor (Adotante promovido)
    -- ON DELETE SET NULL -> Se o Tutor for removido, o Pet volta a ficar sem tutor (disponível)
    CONSTRAINT fk_pets_tutor FOREIGN KEY (id_tutor)
        REFERENCES adotantes (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Índices para consultas dinâmicas multi-critério
CREATE INDEX idx_pets_nome ON pets (nome);
CREATE INDEX idx_pets_tutor ON pets (id_tutor);
CREATE INDEX idx_pets_cidade ON pets (cidade);
CREATE INDEX idx_pets_nome_fts ON pets USING gin(to_tsvector('portuguese', nome));
CREATE INDEX idx_pets_nome_fts ON adotantes USING gin(to_tsvector('portuguese', nome));