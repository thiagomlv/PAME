import inquirer from 'inquirer';
import { Cabecalho, CPF, ValidarContaFuncionario, ValidarData, Formatar, ID } from './funcoesAuxiliares.js';
import { BDManager } from './BDconfig.js';
import { Console } from 'console';

class Sistema {

    // Metodo inicial: é chamado para iniciar o sistema
    iniciar() {
        this.exibirTelaInicial();
    }

    async publicarDado(destino, dados) {
        try {
            BDManager.publicarDado(destino, dados);
        }
        catch {
            console.log("Ocorreu um erro inesperado. Voltando ao menur iniciar...");  
            await this.esperar(5000); // Pausa de 5 segundos
            await this.exibirTelaInicial();
        }
    }

    // Função que exibe a primeira tela do sistema
    async exibirTelaInicial() {

        console.clear() // Limpa o terminal

        console.log('\n==================================================\n');
        console.log('     ______         _                         ');
        console.log('    |  ____|       | |                        ');
        console.log('    | |__   _____  | |     _   _  __  __  ___      ');
        console.log('    |  __| |_____| | |    | | | | \\ \\/ / / _ \\     ');
        console.log('    | |            | |___ | |_| |  >  < | (_) |    ');
        console.log('    |_|            |_____| \\___/  /_/\\_\\ \\___/     \n');
        console.log('                                         HOTEL');  
        
        Cabecalho.exibir('BEM-VINDO');
        
        // Chama o metodo para o usuario escolher o tipo de usuario
        await this.selecionarTipoDeUsuario();
    }

    // Selecionar modo do usuario entre Funcionario e Cliente
    async selecionarTipoDeUsuario() {
        inquirer
            .prompt([
                {
                    type:  'list',
                    name: 'tipoDeUsuario',
                    message: 'Entrar como:\n',
                    choices:['Funcionario', 'Cliente'],
                }
            ],)
            .then(async (answers) => {
                await this.selecionarModoDeEntrada(answers.tipoDeUsuario); // Chama a funcao para selecionar modo de entrada
            })
            .catch((error) => {
                if (error.name === 'ExitPromptError') console.log('\nO usuário forçou o fechamento do aplicativo.');
                else console.log(`Ocorreu um erro: ${error}`);
            });
    }

    // Selecionar modo de entrada: Logar numa conta existente ou criar uma nova conta
    async selecionarModoDeEntrada(tipoDeUsuario) {
        
        console.clear(); // Limpa o terminal
        (tipoDeUsuario === 'Funcionario') ? Cabecalho.exibir('AREA DO FUNCIONARIO') : Cabecalho.exibir('AREA DO CLIENTE') // Exibicao do cabecalho se o usuario for um funcionar

        // Menu de selecao do modo de entrada
        inquirer
            .prompt([
                {
                    type:  'list',
                    name: 'modoDeEntrada',
                    message: 'Selecione uma opcao:\n',
                    choices: ['Entrar na minha conta', 'Criar uma conta', 'Sair do programa'],
                }
            ],)
            .then(async (answers) => {
                if (answers.modoDeEntrada === 'Entrar na minha conta')
                    await this.acessarConta(tipoDeUsuario);
                else if ((answers.modoDeEntrada === 'Criar uma conta'))
                    await this.criarConta(tipoDeUsuario);
                else {
                    console.clear();
                    Cabecalho.exibir('VOLTE SEMPRE');
                    await this.esperar(2000);
                }
            })
            .catch((error) => {
                if (error.name === 'ExitPromptError') console.log('\nO usuário forçou o fechamento do aplicativo.');
                else console.log(`Ocorreu um erro: ${error}`);
            });
    }

    // Fazer login em conta existente
    async acessarConta(tipoDeUsuario) {

        let matchFlag = false; // Diz se a senha corresponde a cadastrada no sistema 
        let tabela = (tipoDeUsuario === 'Funcionarios') ? await BDManager.obterTabela('funcionarios') : await BDManager.obterTabela('clientes'); // Pega os dados mais recentes do banco de dados
        
        let cpfsCadastrados = [];
        for (let i = 0; i < tabela.length; i++) {
            cpfsCadastrados.push(tabela[i].cpf);
            console.log(cpfsCadastrados);
            await this.esperar(1);
        }

        while (true) {
            try {
                console.clear(); // Limpa o terminal
                Cabecalho.exibir(`ACESSAR CONTA - ${tipoDeUsuario}`) // Exibit cabecalho

                if (matchFlag) console.log('Senha incorreta.\n');

                // Exibe a pergunta no terminal e coleta a resposta
                const anwsers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'cpf',
                        message: ' Digite seu CPF: ',
                        transformer: (input) => {
                            return Formatar.cpf(input);
                        },
                    },
                    {
                        type: 'input',
                        name: 'senha',
                        message: ' Digite sua senha: ',
                    },
                ]);
                  
                let usuario = await this.encontrarUsuarioPorCPF(tipoDeUsuario, anwsers.cpf); // Pega o obj do usuario

                if (usuario.senha !== anwsers.senha) {
                    matchFlag = true;
                    continue;
                }
                else {
                    if (tipoDeUsuario === 'Funcionario') this.menuFuncionarioLogado(usuario);
                    //else this.menuClienteLogado(usuario);
                    break;
                }
            } 
            catch (error) {
                console.error(`Erro: ${error.message}`);
                await this.esperar(5000);
            }
        }
    }

    // Criar nova conta
    async criarConta(tipoDeUsuario) {

        let ids = [];
        let usuarios = [];
        let cpfs = [];
        let sucesso = false;
        let prefix;

        if (tipoDeUsuario === 'Funcionario') {

            let dados = {
                id: '',
                nome: '',
                usuario: '',
                cpf: '',
                email: '',
                senha: '',
            };

            let tabela = await BDManager.obterTabela('funcionarios'); // Pega os dados mais recentes do banco de dados

            prefix = 'F'; // Prefixo do ID para funcionarios

            for (let i = 0; i < tabela.length; i++) { // Gera uma tabela com os ids existentes
                ids.push(tabela[i].id);
            }

            for (let i = 0; i < tabela.length; i++) { // Gera uma tabela com os usuarios existentes
                usuarios.push(tabela[i].usuario);
            }

            for (let i = 0; i < tabela.length; i++) { // Gera uma tabela com os cpfs existentes
                cpfs.push(tabela[i].cpf);
            }
            
            dados.id = ID.gerar(prefix, ids); // Atribuindo um id

            // Formulario de criacao de conta
            while (true) {
                try {
                    if (!await this.perguntarNome(tipoDeUsuario, dados)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarUser(tipoDeUsuario, dados, usuarios)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarCPF(tipoDeUsuario, dados, cpfs)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarEmail(tipoDeUsuario, dados)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarSenha(tipoDeUsuario, dados)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    await this.publicarDado('funcionarios', dados); // Publica o usuario no banco de dados
                    sucesso = true;
                    break;
                }
                catch(err) {
                    console.log("Error: ", err);
                }
            }
        }
        else if (tipoDeUsuario === 'Cliente') {

            let dados = {
                id: '',
                nome: '',
                nascimento: '',
                cpf: '',
                email: '',
                senha: '',
            };

            let tabela = await BDManager.obterTabela('clientes'); // Pega os dados mais recentes do banco de dados

            prefix = 'C'; // Prefixo do ID para clientes

            // Gera uma tabela com os ids existentes
            for (let i = 0; i < tabela.length; i++) {
                ids.push(tabela[i].id);
            }
            
            dados.id = ID.gerar(prefix, ids); // Atribuindo um id

            // Formulario de criacao de conta
            while (true) {
                try {
                    if (!await this.perguntarNome(tipoDeUsuario, dados)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarNascimento(tipoDeUsuario, dados)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarCPF(tipoDeUsuario, dados, cpfs)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarEmail(tipoDeUsuario, dados)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarSenha(tipoDeUsuario, dados)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    await this.publicarDado('clientes', dados); // Publica o usuario no banco de dados
                    sucesso = true;
                    break;
                }
                catch(err) {
                    console.log("Error: ", err);
                }
            }
        }

        if (sucesso) await this.acessarConta(tipoDeUsuario); // Ao terminar de criar conta vai para tela de login
    }   


    /*
    ============================================================================
    ============================================================================
    FUNCOES DE FORMULARIO DE CADASTRO
    ============================================================================
    ============================================================================
    */


    // Campo: Nome completo
    async perguntarNome(tipoDeUsuario, dados) {
        while (true) {
            try {
                // Limpa o terminal
                console.clear();

                // Exibicao do cabecalho se o usuario for um funcionario
                Cabecalho.exibir(`CRIAR CONTA - ${tipoDeUsuario}`)

                // Exibe a pergunta no terminal e coleta a resposta
                const answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'nomeCompleto',
                        message: ' Digite seu nome completo: ',
                        transformer: (input) => {
                            // Exibe o nome formatado enquanto o usuário digita
                            return Formatar.nome(input);
                        },
                        validate: (input) => {
                            if ( ! input ) return '\n O nome nao pode ser nao-nulo.';
                            return true;
                        },
                    },
                ]);

                // Confirmar dados
                let confirmacao = await this.confirmarDados('nome completo');

                if (confirmacao === 'Confirmar') {
                    dados.nome = Formatar.nome(answers.nomeCompleto); 
                    return true; // Sai do loop se o nome de usuário for válido
                }
                else if (confirmacao === 'Editar'){
                    continue;
                }
                else {
                    return false;
                }

            } 
            catch (error) {
                console.error(`Erro: ${error.message}`);
                return false;
            }
        }
    }

    // Campo: Data de nascimento
    async perguntarNascimento(tipoDeUsuario, dados) {
        while (true) {
            try {
                console.clear(); // Limpa o terminal
                Cabecalho.exibir(`CRIAR CONTA - ${tipoDeUsuario}`); // Exibicao do cabecalho se o usuario for um funcionario

                let data;

                // Exibe a pergunta no terminal e coleta a resposta
                const answers = await inquirer.prompt([
                    {
                      type: 'list',
                      name: 'ano',
                      message: 'Selecione o ano do seu nascimento:\n',
                      choices: ValidarData.anos,
                    },
                    {
                      type: 'list',
                      name: 'mes',
                      message: 'Selecione o mês do seu nascimento:\n',
                      choices: ValidarData.meses,
                    },
                ]);

                const answer = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'dia',
                        message: 'Selecione o dia do seu nascimento:\n' ,
                        choices: ValidarData.obterDiasDoMes(answers.mes, answers.ano),
                    }
                ])

                // Confirmar dados
                let confirmacao = await this.confirmarDados('data de nascimento');

                if (confirmacao === 'Confirmar') {
                    data = `${answer.dia}/${ValidarData.formatar(answers.mes)}/${answers.ano}`
                    dados.nascimento = data; 
                    return true; // Sai do loop se o nome de usuário for válido
                }
                else if (confirmacao === 'Editar'){
                    continue;
                }
                else {
                    return false;
                }

            } 
            catch (error) {
                console.error(`Erro: ${error.message}`);
            }
        }
    }

    // Campo: Nome de usuario
    async perguntarUser(tipoDeUsuario, dados) {

        let tabela = (tipoDeUsuario === 'Funcionario') ? await BDManager.obterTabela('funcionarios') : await BDManager.obterTabela('clientes'); // Pega os dados mais recentes do banco de dados
        let usuariosCadastrados = [];
        for (let i=0; i < tabela.length; i++) {
            usuariosCadastrados.push(tabela[i].usuario);
        }

        while (true) {
            try {
                // Limpar o terminal
                console.clear();

                // Exibicao do cabecalho se o usuario for um funcionario
                Cabecalho.exibir(`CRIAR CONTA - ${tipoDeUsuario}`)


                // Exibe a pergunta no terminal e coleta a resposta
                let answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'nomeUsuario',
                        message: ' Escolha um nome de usuario: ',
                        validate: (input) => {
                            if ( ! ValidarContaFuncionario.nomeUsuario(input, usuariosCadastrados) ) return '\n O nome de usuaria nao esta disponivel.';
                            return true;
                        },
                    },
                ]);

                // Confirmar dados
                let confirmacao = await this.confirmarDados('nome de usuario');

                if (confirmacao === 'Confirmar') {
                    dados.usuario = answers.nomeUsuario; 
                    return true; // Sai do loop se o nome de usuário for válido
                }
                else if (confirmacao === 'Editar'){
                    continue;
                }
                else {
                    return false;
                }
            } catch (error) { 
                console.error(`Erro: ${error.message}`);
            }
        }
    }

    // Campo: CPF
    async perguntarCPF(tipoDeUsuario, dados) {

        let tabela = (tipoDeUsuario === 'Funcionario') ? await BDManager.obterTabela('funcionarios') : await BDManager.obterTabela('clientes'); // Pega os dados mais recentes do banco de dados
        let cpfsCadastrados = [];
        for (let i=0; i < tabela.length; i++) {
            cpfsCadastrados.push(tabela[i].cpf);
        }

        while (true) {
            try {
                // Limpar o terminal
                console.clear();

                // Exibicao do cabecalho se o usuario for um funcionario
                Cabecalho.exibir(`CRIAR CONTA - ${tipoDeUsuario}`)

                // Exibe a pergunta no terminal e coleta a resposta
                let answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'cpf',
                        message: ' Digite seu cpf (apenas numeros): ',
                        transformer: (input) => {
                            return Formatar.cpf(input); // Formata o CPF enquanto o usuário digita
                        },
                        validate: (input) => {
                            const apenasNumeros = input.replace(/[^\d]+/g,'');
                            if ( apenasNumeros.length > 11 ) return '\nO CPF deve ter no máximo 11 números.';
                            if ( apenasNumeros.length < 11 ) return '\nO CPF deve ter exatamente 11 números.';
                            if ( ! CPF.validar(input) ) return '\nCPF inválido.';
                            if ( cpfsCadastrados.includes(input.replace(/[^\d]+/g,'')) ) return '\nCPF existente no sistema.'
                            return true;
                        },
                        filter: (input) => input.replace(/[^\d]+/g,''), // Remove caracteres inválidos
                    },
                ]);

                // Confirmar dados
                let confirmacao = await this.confirmarDados('CPF');

                if (confirmacao === 'Confirmar') {
                    dados.cpf = answers.cpf; 
                    return true; // Sai do loop se o nome de usuário for válido
                }
                else if (confirmacao === 'Editar'){
                    continue;
                }
                else {
                    return false;
                }

            } catch (error) {
                console.error(`Erro: ${error.message}`);
            }
        }
    }

    // Campo: Email
    async perguntarEmail(tipoDeUsuario, dados) {
        while (true) {
            try {
                // Limpar o terminal
                console.clear()

                // Exibicao do cabecalho se o usuario for um funcionario
                Cabecalho.exibir(`CRIAR CONTA - ${tipoDeUsuario}`)

                // Exibe a pergunta no terminal e coleta a resposta
                let answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'email',
                        message: ' Digite seu email: ',
                    },
                ]);

                // Confirmar dados
                let confirmacao = await this.confirmarDados('email');

                if (confirmacao === 'Confirmar') {
                    dados.email = answers.email; 
                    return true; // Sai do loop se o nome de usuário for válido
                }
                else if (confirmacao === 'Editar'){
                    continue;
                }
                else {
                    return false;
                }

            } catch (error) {
                console.error(`Erro do tipo: ${error.message}`);
            }
        }
    }

    // Campo: Senha
    async perguntarSenha(tipoDeUsuario, dados) {
        while (true) {
            try {
                // Limpar o terminal
                console.clear()

                // Exibicao do cabecalho se o usuario for um funcionario
                Cabecalho.exibir(`CRIAR CONTA - ${tipoDeUsuario}`)

                // Exibe a pergunta no terminal e coleta a resposta
                let answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'senha_1',
                        message: ' Crie uma senha de acesso: ',
                    },
                    {
                        type: 'input',
                        name: 'senha_2',
                        message: ' Repita a senha: ',
                    },
                ]);

                // Confirmar dados
                if (answers.senha_1 != answers.senha_2) {
                    continue;
                }
                else {
                    dados.senha = answers.senha_2;
                    return true; // Sai do loop se o nome de usuário for válid
                } 
            } 
            catch (error) {
                console.error(`Erro do tipo: ${error.message}`);
                break;
            }
        }
    }

    // Confirmar dados
    async confirmarDados(dado) {
        // Campo: confirmar
        while (true) {
            try {

                console.log('\n==================================================\n');

                // Exibe a pergunta no terminal e coleta a resposta
                let answers = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'confirmacao',
                        message: ` Confirmar ${dado}?\n`,
                        choices: ['Confirmar', 'Editar', 'Voltar ao menu inicial']
                    },
                ]);

                return answers.confirmacao;

            } catch (error) {
                console.error(`Erro: ${error.message}`);
            }
        }
    }


    /*
    ============================================================================
    ============================================================================
    METODOS DE USUARIOS LOGADO
    ============================================================================
    ============================================================================
    */

    // Campo: Nome de usuario
    async menuFuncionarioLogado(usuario) {
        try {
            console.clear();// Limpar o terminal
            Cabecalho.areaFuncionario(usuario.nome); // Exibicao do cabecalho se o usuario for um funcionario
            const opcoes = [ // Opcoes do menu
                'Ver meus dados', 
                'Ver lista de reservas', 
                'Ver lista de quartos', 
                'Ver lista de clientes',
                'Mudar status da reserva',
                'Adicionar quarto'
            ];

            // Exibe a pergunta no terminal e coleta a resposta
            let answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'op',
                    message: 'Selecione uma opcao:\n',
                    choices: opcoes,
                },
            ]);

            if (answers.op === opcoes[0]) {
                await this.visualizarDados(usuario, 'Funcionario');
            }
            else if (answers.op === opcoes[1]){
                //this.listarReservas();
            }
            else if (answers.op === opcoes[2]){
                //this.listarQuartos();
            }
            else if (answers.op === opcoes[3]){
                //this.listarClientes();
            }
            else if (answers.op === opcoes[4]){
                //this.mudarStatusReserva();
            }
            else if (answers.op === opcoes[4]){
                //this.adicioanarQuarto();
            }
            else {
                throw new Error('Erro inesperado.')
            }
        } catch (error) { 
            console.error(`Erro: ${error.message}`);
        }
    }

    async visualizarDados(usuario, tipoDeUsuario) {
        try {
            console.clear();// Limpar o terminal
            Cabecalho.exibir('Meus dados'); // Exibicao do cabecalho se o usuario for um funcionario

            // Exibe os dados do usuario
            if (tipoDeUsuario === 'Funcionario') {
                console.log(`Nome: ${usuario.nome}`);
                console.log(`CPF: ${Formatar.cpf(usuario.cpf)}`);
                console.log(`Usuario: ${usuario.usuario}`);
                console.log(`Email: ${usuario.email}`);
                console.log('Senha: ' + '*'.repeat(usuario.senha.length));
            }
            else {
                console.log(`Nome: ${usuario.nome}`);
                console.log(`CPF: ${usuario.cpf}`);
                console.log(`Nascimento: ${Formatar.cpf(usuario.cpf)}`);
                console.log(`Email: ${usuario.email}`);
                console.log('Senha: ' + '*'.repeat(usuario.senha.length));
            }

            Cabecalho.exibirLinha();
            
            const opcoes = ['Voltar ao menu inicial', 'Editar meus dados']; // Opcoes do menu

            // Exibe a pergunta no terminal e coleta a resposta
            let answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'op',
                    message: 'Selecione uma opcao:\n',
                    choices: opcoes,
                },
            ]);

            if (answers.op === opcoes[0]) {
                (tipoDeUsuario === 'Funcionario') ? await this.menuFuncionarioLogado(usuario) : await this.menuClienteLogado(usuario);
            }
            else if (answers.op === opcoes[1]){
                await this.menuSelecionarDadoUsuario(usuario, tipoDeUsuario);
            }
        } catch (error) { 
            console.error(`Erro: ${error.message}`);
        }
    }

    // Editar dados de um usuario
    async menuSelecionarDadoUsuario(usuario, tipoDeUsuario) {
        try {
            console.clear();// Limpar o terminal
            Cabecalho.exibir('Editar dados'); // Exibicao do cabecalho se o usuario for um funcionario
            
            // Exibe os dados do usuario
            if (tipoDeUsuario === 'Funcionario') {
                console.log(`Nome: ${usuario.nome}`);
                console.log(`CPF: ${Formatar.cpf(usuario.cpf)}`);
                console.log(`Usuario: ${usuario.usuario}`);
                console.log(`Email: ${usuario.email}`);
                console.log('Senha: ' + '*'.repeat(usuario.senha.length));
            }
            else {
                console.log(`Nome: ${usuario.nome}`);
                console.log(`CPF: ${usuario.cpf}`);
                console.log(`Nascimento: ${Formatar.cpf(usuario.cpf)}`);
                console.log(`Email: ${usuario.email}`);
                console.log('Senha: ' + '*'.repeat(usuario.senha.length));
            }

            Cabecalho.exibirLinha();
            
            let opcoes = (tipoDeUsuario === 'Funcionario') ? ['Nome', 'CPF', 'Usuario', 'Email', 'Senha', 'Voltar ao menu inicial'] : ['Nome', 'CPF', 'Data de Nascimento', 'Email', 'Senha', 'Voltar ao menu inicial']; // Opcoes do menu

            // Exibe a pergunta no terminal e coleta a resposta
            await inquirer.prompt([
                {
                    type: 'list',
                    name: 'op',
                    message: 'Selecione o dado a ser alterado:\n',
                    choices: opcoes,
                },
            ]).then(async (answers) => {
                if (answers.op === 'Voltar ao menu inicial') {
                    (tipoDeUsuario === 'Funcionario') ? await this.menuFuncionarioLogado(usuario) : await this.menuClienteLogado(usuario)
                }
                else {
                    while (true) {
                        try {
                            if (answers.op === 'Nome') {
                                if (!await this.perguntarNome(tipoDeUsuario, usuario)) {
                                    (tipoDeUsuario === 'Funcionario') ? await this.menuFuncionarioLogado(usuario) : await this.menuClienteLogado(usuario);
                                    break;
                                }
                            } else if (answers.op === 'Usuario') {
                                if (!await this.perguntarUsuario(tipoDeUsuario, usuario)) {
                                    (tipoDeUsuario === 'Funcionario') ? await this.menuFuncionarioLogado(usuario) : await this.menuClienteLogado(usuario);
                                    break;
                                }
                            } else if (answers.op === 'Nascimento') {
                                if (!await this.perguntarNascimento(tipoDeUsuario, usuario)) {
                                    (tipoDeUsuario === 'Funcionario') ? await this.menuFuncionarioLogado(usuario) : await this.menuClienteLogado(usuario);
                                    break;
                                }
                            } else if (answers.op === 'CPF') {
                                if (!await this.perguntarCPF(tipoDeUsuario, usuario)) {
                                    (tipoDeUsuario === 'Funcionario') ? await this.menuFuncionarioLogado(usuario) : await this.menuClienteLogado(usuario);
                                    break;
                                }
                            } else if (answers.op === 'Email') {
                                if (!await this.perguntarEmail(tipoDeUsuario, usuario)) {
                                    (tipoDeUsuario === 'Funcionario') ? await this.menuFuncionarioLogado(usuario) : await this.menuClienteLogado(usuario);
                                    break;
                                }
                            } else if (answers.op === 'Senha') {
                                if (!await this.perguntarSenha(tipoDeUsuario, usuario)) {
                                    (tipoDeUsuario === 'Funcionario') ? await this.menuFuncionarioLogado(usuario) : await this.menuClienteLogado(usuario);
                                    break;
                                }
                            }
                            break;
                        } catch(err) {
                            console.log(`Erro inesperado: ${err}`);
                        }
                    }

                    await BDManager.atualizarObjeto((tipoDeUsuario === 'Funcionario') ? 'funcionarios' : 'clientes', usuario); // atualiza o objeto no banco de dado            
                    await this.visualizarDados(usuario);
                }
            });
        }
        catch (error) { 
            console.error(`Erro: ${error.message}`);
        }
    }

    // Retorna a tabela das classes
    async obterTabela(tabela) {
        if (tabela === 'Funcionario') return await BDManager.obterTabela('funcionarios');
        else if (tabela === 'Cliente') return await BDManager.obterTabela('clientes');
        else if (tabela === 'Quarto') return await BDManager.obterTabela('quartos');
        else if (tabela === 'Reserva') return await BDManager.obterTabela('reservas');
    }

    // Esperar tantos segundos
    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async encontrarUsuarioPorCPF(tipoDeUsuario, cpf) {

        let tabela = await this.obterTabela(tipoDeUsuario)
        let indice = 0;

        // Busca qual usuario tem o cpf desejado
        for (let i=0; i < tabela.length; i++) {
            if (cpf === tabela[i].cpf) {
                indice = i;
                break;
            }
        }

        return tabela[indice]; // retorna o objeto completo do usuario
    }

    async encontrarObjetoPorID(classe, id) {

        let tabela = await this.obterTabela(classe)
        let indice = 0;

        // Busca qual usuario tem o cpf desejado
        for (let i=0; i < tabela.length; i++) {
            if (id === tabela[i].id) {
                indice = i;
                break;
            }
        }

        return tabela[indice]; // retorna o objeto completo do usuario
    }
}

// Iniciar sistema
const FLuxoHotel = new Sistema();
FLuxoHotel.iniciar();