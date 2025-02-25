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
        const totalCaracteres = 50;
        const espacos = totalCaracteres - texto.length;
        const espacosEsquerda = Math.floor(espacos / 2);
        const espacosDireita = Math.ceil(espacos / 2);
        const resultado = " ".repeat(espacosEsquerda) + texto + " ".repeat(espacosDireita);
        
        return resultado;
    }

    static ajustarEsquerda(texto) {
        const totalCaracteres = 50;
        const espacos = totalCaracteres - texto.length;
        const espacosDireita = espacos - 2
        const resultado = "  " + texto + " ".repeat(espacosDireita);

        return resultado;
    }

    static exibir(texto) {

        console.log('\n' + '='.repeat(50));
        console.log(this.centralizar(texto));
        console.log('='.repeat(50) + '\n');
    }

    static areaFuncionario(nome) {
        
        console.log('\n' + '='.repeat(50));
        console.log(this.ajustarEsquerda(`Bem vindo ao F-luxo Hotel, ${nome.split(' ')[0]}`));
        console.log('='.repeat(50) + '\n');
    }

    static exibirLinha() {
        console.log('\n' + '='.repeat(50) + '\n');
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
        
}

export class ID {
    static gerar(prefixo, id_list) {
        let numeroAleatorio;
        do {
            numeroAleatorio = Math.random().toFixed(4).substring(2);
        }
        while ( id_list.includes(numeroAleatorio) )
        return `${prefixo}${numeroAleatorio}`;
    }
}