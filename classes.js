export class Cliente {
    constructor(id, nome, dataNascimento, cpf, email, senha) {
        this.id = id;
        this.nome = nome;
        this.nascimento = dataNascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

export class Funcionario {
    // Atribuindo valor inicial aos atributos base
    constructor(id, nome, usuario, cpf, email, senha) {
        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

export class Quarto {

}

export class Reserva {
    
}