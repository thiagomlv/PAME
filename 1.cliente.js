export class Cliente {

    // Atribuindo valor inicial aos atributos base
    constructor(id, nome, dataNascimento, cpf, email, senha) {
        this.id = id;
        this.nome = nome;
        this.nascimento = dataNascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}