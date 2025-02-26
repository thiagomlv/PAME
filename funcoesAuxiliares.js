import { BDManager } from "./BDconfig.js";

export class CPF {
    // Metodo de validacao do CPF.
    // Eh estatico para nao ter necessidade de criar uma instancia da classe toda vez que for usa-lo.
    static validar(cpf) {

        cpf.replace(/[^\d]+/g,''); // cpf sem caracteres especiais

        // declara as variveis usadas
        let add;
        let rev;

        if(cpf == '') return false;	

        // Elimina cpfs invalidos conhecidos	
        if (cpf.length != 11 || 
            cpf == "00000000000" || 
            cpf == "11111111111" || 
            cpf == "22222222222" || 
            cpf == "33333333333" || 
            cpf == "44444444444" || 
            cpf == "55555555555" || 
            cpf == "66666666666" || 
            cpf == "77777777777" || 
            cpf == "88888888888" || 
            cpf == "99999999999")
            return false;	

        // Valida 1o digito	
        add = 0;	
        for (let i=0; i < 9; i ++)		
            add += parseInt(cpf.charAt(i)) * (10 - i);	
            rev = 11 - (add % 11);	
            if (rev == 10 || rev == 11)		
                rev = 0;	
            if (rev != parseInt(cpf.charAt(9)))		
                return false;	

        // Valida 2o digito	
        add = 0;	
        for (let i = 0; i < 10; i ++)		
            add += parseInt(cpf.charAt(i)) * (11 - i);	
        rev = 11 - (add % 11);	
        if (rev == 10 || rev == 11)	
            rev = 0;	
        if (rev != parseInt(cpf.charAt(10)))
            return false;		
        return true;  
    }
}

export class Cabecalho {

    static centralizar(texto) {
        const totalCaracteres = 70;
        const espacos = totalCaracteres - texto.length;
        const espacosEsquerda = Math.floor(espacos / 2);
        const espacosDireita = Math.ceil(espacos / 2);
        const resultado = " ".repeat(espacosEsquerda) + texto + " ".repeat(espacosDireita);
        
        return resultado;
    }

    static ajustarEsquerda(texto) {
        const totalCaracteres = 70;
        const espacos = totalCaracteres - texto.length;
        const espacosDireita = espacos - 2
        const resultado = "  " + texto + " ".repeat(espacosDireita);

        return resultado;
    }

    static exibir(texto) {

        console.log('\n' + '='.repeat(70));
        console.log(this.centralizar(texto));
        console.log('='.repeat(70) + '\n');
    }

    static areaUsuario(nome) {
        
        console.log('\n' + '='.repeat(70));
        console.log(this.ajustarEsquerda(`Bem vindo ao Hotel F-Luxo, ${nome.split(' ')[0]}`));
        console.log('='.repeat(70) + '\n');
    }

    static exibirLinha() {
        console.log('\n' + '='.repeat(70) + '\n');
    }
    
    static exibirQuartos(listaDeQuartos) {
        this.exibir('Lista de quartos');

        if (listaDeQuartos.length !== 0 && Object.keys(listaDeQuartos[0]).length > 0) {
            for (let i=0; i<listaDeQuartos.length; i++) {
                console.log(`Quarto: ${listaDeQuartos[i].nome}`);
                console.log(`Quantidade de camas: ${listaDeQuartos[i].camas}`);
                console.log(`Preco por noite: ${listaDeQuartos[i].preco}`);
                console.log(`Decricao: ${listaDeQuartos[i].descricao}`);
                this.exibirLinha();
            }
        }
        else {
            console.log(this.ajustarEsquerda('Não existem quartos cadastrados no sistema.'));
            this.exibirLinha();
        }
    }

    static exibirClientes(listaDeClientes) {
        this.exibir('Lista de clientes');
        
        if (listaDeClientes.length !== 0 && Object.keys(listaDeClientes[0]).length > 0) {
            for (let i=0; i<listaDeClientes.length; i++) {
                console.log(`Nome: ${listaDeClientes[i].nome}`);
                console.log(`CPF: ${Formatar.cpf(listaDeClientes[i].cpf)}`);
                console.log(`Data de nascimento: ${listaDeClientes[i].nascimento}`);
                console.log(`Email: ${listaDeClientes[i].email}`);
                this.exibirLinha();
            }
        }
        else {
            console.log(this.ajustarEsquerda('Não existem clientes cadastrados no sistema.'));
            this.exibirLinha();
        }
    }

    static async exibirReservas(listaDeReservas) {
        this.exibir('Lista de reservas');

        if (listaDeReservas.length !== 0 && Object.keys(listaDeReservas[0]).length > 0) {
            for (let i=0; i<listaDeReservas.length; i++) {
                // Verifica se a reserva esta cancelada
                if (listaDeReservas[i].status === 'Cancelada') continue;

                let cliente = await Encontrar.objetoPorID('clientes', listaDeReservas[i].idCliente);

                console.log(`ID da reserva: ${listaDeReservas[i].id}`);
                console.log(`Cliente: ${cliente.nome}`);
                console.log(`Status: ${listaDeReservas[i].status}`);
                console.log(`Entrada: ${listaDeReservas[i].entrada}`);
                console.log(`Saida: ${listaDeReservas[i].saida}`);
                this.exibirLinha();
            }
        }
        else {
            console.log(this.ajustarEsquerda('Não existem reservas cadastradas no sistema.'));
            this.exibirLinha();
        }
    }
}

export class Encontrar { 
    static async objetoPorID(classe, id) {

        let tabela = await BDManager.obterTabela(classe)
        let indice = 0;

        // Busca qual usuario tem o id desejado
        for (let i=0; i < tabela.length; i++) {
            if (id === tabela[i].id) {
                indice = i;
                break;
            }
        }
        return tabela[indice]; // retorna o objeto completo do usuario
    }
}

export class ValidarData {

    // Lista fixa de meses
    static meses = [
        'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
  
    // Últimos 120 anos
    static anoAtual = new Date().getFullYear();
    static anos = Array.from({ length: 120 }, (_, i) => (this.anoAtual - i).toString());
    static anosReserva = Array.from({ length: 2 }, (_, i) => (this.anoAtual + i).toString());

    // Lista de meses divididas por quantidade de dias
    static mesesCom31Dias = ['Janeiro', 'Marco', 'Maio', 'Julho', 'Agosto', 'Outubro', 'Dezembro'];
    static mesesCom30Dias = ['Abril', 'Junho', 'Setembro', 'Novembro'];

    // Verifica se o ano é bissexto
    static ehAnoBissexto(ano) {
        return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
    }

    // Retorna a quantidade de dias que um mês tem
    static obterDiasDoMes(mes, ano) {
        let dias;

        if (this.mesesCom30Dias.includes(mes)) {
            dias = 30;
        } else if (this.mesesCom31Dias.includes(mes)) {
            dias = 31;
        } else if (mes === 'Fevereiro') {
            dias = this.ehAnoBissexto(ano) ? 29 : 28;
        } else {
            throw new Error('Mês inválido');
        }

        // Retorna um array com os dias do mês
        return Array.from({ length: dias }, (_, i) => (i + 1).toString());
    }

    static formatar(mes) {
        for (let i=0; i < this.meses.length; i++) {
            if (mes === this.meses[i]) return i+1
        }
    }
}

export class ValidarContaFuncionario {

    static nomeUsuario(nome, funcionarios) {
        if (! funcionarios.includes(nome)) return true;
    }

}

export class Formatar {
    // Formata o nome completo para que o nome e os sobrenomes estejam em letra maiuscula
    static nome(nome) {
        return nome
            .toLowerCase() // Converte toda a string para minúsculas
            .split(' ') // Divide a string em um array de palavras
            .map((palavra) => {
                // Converte a primeira letra de cada palavra para maiúscula
                return palavra.charAt(0).toUpperCase() + palavra.slice(1);
            })
            .join(' '); // Junta as palavras novamente em uma única string
    }

    static cpf(cpf) {
        // Remove tudo que não for número
        cpf = cpf.replace(/\D/g, '');
        
        // Aplica a formatação 000.000.000-00
        return cpf
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen
    }

    static nomeQuarto(nome) {
        nome = nome.charAt(0).toUpperCase() + nome.slice(1);
        return nome.replace(/^(.)(.)/, '$1-$2');
    }

    static preco(preco) {
       // Remove  caracteres nao numericos
        preco.replace(/\D/g, '');

        // Garante que o número tenha pelo menos 2 dígitos
        preco = preco.padStart(2, '0');

        // Separa a parte inteira e a parte decimal
        let parteInteira = preco.slice(0, -2) || '0'; // Se não houver parte inteira, usa '0'
        let parteDecimal = preco.slice(-2);

        if (parteDecimal.length === 1) return true;

        // Formata a parte inteira com pontos a cada 3 dígitos
        parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Retorna o preço formatado
        return `${parteInteira},${parteDecimal}`;
    }

    static frase(frase) {
        let flag = true;
        return frase
            .toLowerCase() // Converte toda a string para minúsculas
            .split(' ') // Divide a string em um array de palavras
            .map((palavra) => {
                // Converte a primeira letra de cada palavra para maiúscula
                if (flag) {
                    flag = false;
                    return palavra.charAt(0).toUpperCase() + palavra.slice(1);
                }
                return palavra
            })
            .join(' '); // Junta as palavras novamente em uma única string
    }

    static contemApenasNumeros(str) {
        // Percorre cada caractere da string
        for (let i = 0; i < str.length; i++) {
            // Verifica se o caractere nao e um numero
            if (str[i] < '0' || str[i] > '9') {
                return false; // Retorna falso se encontrar um caractere nao numerico
            }
        }
        return true; // Retorna verdadeiro se todos os caracteres forem numeros
    }
}

export class ValidarQuarto {
    static nome(nome) {
        // Verifica se o input tem exatamente 4 caracteres
        if (nome.length !== 4) {
            return false;
        }

        // Verifica se o primeiro caractere é uma letra e os três últimos são números
        if (/^[A-Za-z]/.test(nome[0]) && /^\d{3}$/.test(nome.slice(1))) {
            return true;
        } else {
            return false;
        }
    }
}

export class ID {
    static gerar(prefixo, idsList) {
        let numeroAleatorio;
        do {
            numeroAleatorio = Math.random().toFixed(4).substring(2);
        }
        while ( idsList.includes(numeroAleatorio) )
        return `${prefixo}${numeroAleatorio}`;
    }
}