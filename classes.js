export class Cliente {
    constructor(id='', nome='', dataNascimento='', cpf='', email='', senha='') {
        this.id = id;
        this.nome = nome;
        this.nascimento = dataNascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

export class Funcionario {
    constructor(id='', nome='', usuario='', cpf='', email='', senha='') {
        this.id = id;
        this.nome = nome;
        this.usuario = usuario;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

export class Quarto {
    constructor(id='', nome='', camas='', preco='', descricao='') {
        this.id = id;
        this.nome = nome;
        this.camas = camas;
        this.preco = preco;
        this.descricao = descricao;
    }
}

export class Reserva {
    constructor(id='', idCliente='', status='', entrada='', saida='') {
        this.id = id;
        this.idCliente = idCliente;
        this.status = status;
        this.entrada = entrada;
        this.saida = saida;
    }
}