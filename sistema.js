import inquirer from 'inquirer';
import { Cabecalho, CPF, ValidarContaFuncionario, ValidarData, Formatar, ID, ValidarQuarto } from './funcoesAuxiliares.js';
import { BDManager } from './BDconfig.js';
import { Cliente, Quarto, Funcionario, Reserva } from './classes.js';

class Sistema {

    // Metodo inicial: é chamado para iniciar o sistema
    iniciar() {
        this.exibirTelaInicial();
    }

    async publicarDado(destino, objeto) {
        try {
            BDManager.publicarDado(destino, objeto);
        }
        catch {
            console.log("Ocorreu um erro inesperado. Voltando ao menur iniciar...");  
            await this.esperar(3000); // Pausa de 3 segundos
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
                    await this.fechar();
                }
            })
            .catch((error) => {
                if (error.name === 'ExitPromptError') console.log('\nO usuário forçou o fechamento do aplicativo.');
                else console.log(`Ocorreu um erro: ${error}`);
            });
    }

    async fechar() {
        console.clear();
        Cabecalho.exibir('VOLTE SEMPRE');
        await this.esperar(2000);
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
                    else this.menuClienteLogado(usuario);
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

        let sucesso = false;

        if (tipoDeUsuario === 'Funcionario') {

            let funcionario = new Funcionario; // Instancia um novo objeto Funcionario
            let ids = [];
            for (let i=0; i < tabela.length; i++) listaIds.push(tabela[i].id);
            dados.id = ID.gerar('F', ids); // Atribuindo um id

            // Formulario de criacao de conta
            while (true) {
                try {
                    if (!await this.perguntarNome(tipoDeUsuario, funcionario)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarUsuario(tipoDeUsuario, funcionario)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarCPF(tipoDeUsuario, funcionario)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarEmail(tipoDeUsuario, funcionario)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarSenha(tipoDeUsuario, funcionario)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    await this.publicarDado('funcionarios', funcionario); // Publica o usuario no banco de dados
                    sucesso = true;
                    break;
                }
                catch(err) {
                    console.log("Error: ", err);
                }
            }
        }
        else if (tipoDeUsuario === 'Cliente') {

            let cliente = new Cliente(); // instancia um cliente
            let tabela = await BDManager.obterTabela('clientes'); // Pega os dados mais recentes do banco de dados
            let ids = [];
            for (let i=0; i < tabela.length; i++) listaIds.push(tabela[i].id);
            
            cliente.id = ID.gerar('C', ids); // Atribuindo um id

            // Formulario de criacao de conta
            while (true) {
                try {
                    if (!await this.perguntarNome(tipoDeUsuario, cliente)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarNascimento(tipoDeUsuario, cliente)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarCPF(tipoDeUsuario, cliente)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarEmail(tipoDeUsuario, cliente)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    if (!await this.perguntarSenha(tipoDeUsuario, cliente)) {
                        await this.exibirTelaInicial();
                        break;
                    }
                    await this.publicarDado('clientes', cliente); // Publica o usuario no banco de dados
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
    FUNCOES PERGUNTA DE FORMULARIO DE CADASTRO DE USUARIO
    ============================================================================
    ============================================================================
    */

    // Campo: Nome completo
    async perguntarNome(tipoDeUsuario, usuario) {
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
                            return Formatar.nome(input); // Exibe o nome formatado enquanto o usuário digita
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
                    usuario.nome = Formatar.nome(answers.nomeCompleto); 
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
    async perguntarNascimento(tipoDeUsuario, usuario) {
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
                    usuario.nascimento = data; 
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
    async perguntarUsuario(tipoDeUsuario, usuario) {

        let tabela = this.obterTabela(tipoDeUsuario); // Pega a versao mais recente da tabela no banco de dados
        let usuariosCadastrados = [];
        for (let i=0; i < tabela.length; i++) usuariosCadastrados.push(tabela[i].id);

        
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
                    usuario.usuario = answers.nomeUsuario; 
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
    async perguntarCPF(tipoDeUsuario, usuario) {

        let tabela = await this.obterTabela(tipoDeUsuario);
        let cpfsCadastrados = []
        for (let i=0; i < tabela.length; i++) cpfsCadastrados.push(tabela[i].cpf);

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
                        message: ' Digite seu CPF: ',
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
                    usuario.cpf = answers.cpf; 
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
    async perguntarEmail(tipoDeUsuario, usuario) {
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
                    usuario.email = answers.email; 
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
    async perguntarSenha(tipoDeUsuario, usuario) {
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
                    usuario.senha = answers.senha_2;
                    return true; // Sai do loop se o nome de usuário for válid
                } 
            } 
            catch (error) {
                console.error(`Erro do tipo: ${error.message}`);
                break;
            }
        }
    }

    /*
    ============================================================================
    ============================================================================
    FUNCOES PERGUNTA DE FORMULARIO DE CADASTRO DE QUARTO
    ============================================================================
    ============================================================================
    */

    // Campo: Nome do quarto do hotel (ex.: H-205)
    async perguntarNomeQuarto(quarto) {
        while (true) {
            try {
                // Limpar o terminal
                console.clear()

                // Exibicao do cabecalho se o usuario for um funcionario
                Cabecalho.exibir(`ADICIONAR QUARTO`)

                // Exibe a pergunta no terminal e coleta a resposta
                let answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'nomeQuarto',
                        message: ' Nome do quarto (Ex.: G-305): ',
                        transformer: (input) => {
                            return Formatar.nomeQuarto(input); // Exibe o nome formatado enquanto o usuário digita
                        },
                        validate: (input) => {
                            if ( ! ValidarQuarto.nome(input) ) return '\nPadrao invalido.';
                            return true;
                        },
                    },
                ]);

                let confirmacao = await this.confirmarDados('nome do quarto'); // Confirmacao

                if (confirmacao === 'Confirmar') {
                    quarto.nome = Formatar.nomeQuarto(answers.nomeQuarto); // Atribui o valor ao objeto
                    return true; // Retorna true de a opcao de confirmacao foi 'Confirmar'
                } else if (confirmacao === 'Editar') {
                    continue; // Reinicia o loop se foi 'Editar'
                } else {
                    return false; // Opcao: voltar ao menu inicial
                }
            } 
            catch (error) {
                console.error(`Erro do tipo: ${error.message}`);
                break;
            }
        }
    }

    async perguntarQuantidadeCamas(quarto) {
        while (true) {
            try {
                console.clear(); // Limpa o terminal
                Cabecalho.exibir(`ADICIONAR QUARTO`); // Exibicao do cabecalho se o usuario for um funcionario

                // Exibe a pergunta no terminal e coleta a resposta
                const answers = await inquirer.prompt([
                    {
                      type: 'list',
                      name: 'qtdCamas',
                      message: 'Quantidade de camas no quarto:\n',
                      choices: ['1','2','3','4','5','6','7','8','9','10'],
                    },   
                ]);

                let confirmacao = await this.confirmarDados('quantidade de camas'); // Confirmacao

                if (confirmacao === 'Confirmar') {
                    quarto.camas = answers.qtdCamas; // Atribui o valor ao objeto
                    return true; // Retorna true de a opcao de confirmacao foi 'Confirmar'
                } else if (confirmacao === 'Editar') {
                    continue; // Reinicia o loop se foi 'Editar'
                } else {
                    return false; // Opcao: voltar ao menu inicial
                }

            } 
            catch (error) {
                console.error(`Erro: ${error.message}`);
            }
        }
    }

    async perguntarPreco(quarto) {
        while (true) {
            try {
                console.clear(); // Limpa o terminal
                Cabecalho.exibir(`ADICIONAR QUARTO`); // Exibicao do cabecalho se o usuario for um funcionario

                // Exibe a pergunta no terminal e coleta a resposta
                const answers = await inquirer.prompt([
                    {
                      type: 'imput',
                      name: 'preco',
                      message: 'Preco por noite (decimais separados por ponto):\n',
                    },   
                ]);

                let confirmacao = await this.confirmarDados('preco por noite'); // Confirmacao

                if (confirmacao === 'Confirmar') {
                    quarto.preco = answers.preco; // Atribui o valor ao objeto
                    return true; // Retorna true de a opcao de confirmacao foi 'Confirmar'
                } else if (confirmacao === 'Editar') {
                    continue; // Reinicia o loop se foi 'Editar'
                } else {
                    return false; // Opcao: voltar ao menu inicial
                }

            } 
            catch (error) {
                console.error(`Erro: ${error.message}`);
            }
        }
    }

    // Campo: Descricao do quarto
    async perguntarDescricao(quarto) {
        while (true) {
            try {
                console.clear(); // Limpa o terminal
                Cabecalho.exibir(`ADICIONAR QUARTO`); // Exibicao do cabecalho se o usuario for um funcionario

                // Exibe a pergunta no terminal e coleta a resposta
                const answers = await inquirer.prompt([
                    {
                      type: 'imput',
                      name: 'descricao',
                      message: 'Descricao do quarto:\n',
                    },   
                ]);

                let confirmacao = await this.confirmarDados('descricao'); // Confirmacao

                if (confirmacao === 'Confirmar') {
                    quarto.descricao = answers.descricao; // Atribui o valor ao objeto
                    return true; // Retorna true de a opcao de confirmacao foi 'Confirmar'
                } else if (confirmacao === 'Editar') {
                    continue; // Reinicia o loop se foi 'Editar'
                } else {
                    return false; // Opcao: voltar ao menu inicial
                }

            } 
            catch (error) {
                console.error(`Erro: ${error.message}`);
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
                console.error(`Erro: ${error}`);
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


    async menuFuncionarioLogado(usuario) {
        try {
            console.clear();// Limpar o terminal
            Cabecalho.areaUsuario(usuario.nome); // Exibicao do cabecalho se o usuario for um funcionario
            const opcoes = [ // Opcoes do menu
                'Ver meus dados', 
                'Ver lista de reservas', 
                'Ver lista de quartos', 
                'Ver lista de clientes',
                'Mudar status da reserva',
                'Adicionar quarto',
                'Sair'
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
            else if (answers.op === opcoes[5]){
                await this.adicionarQuarto();
            }
            else if (answers.op === opcoes[6]){
                await this.exibirTelaInicial();
            }
            else {
                throw new Error('Erro inesperado.')
            }
        } catch (error) { 
            console.error(`Erro: ${error.message}`);
        }
    }

    // Primeiro menu que o cliente acessa quando loga
    async menuClienteLogado(usuario) {
        try {
            console.clear();// Limpar o terminal
            Cabecalho.areaUsuario(usuario.nome); // Exibicao do cabecalho se o usuario for um funcionario
            const opcoes = [ // Opcoes do menu
                'Ver meus dados', 
                'Ver lista de quartos', 
                'Fazer reserva', 
                'Cancelar reserva',
                'Ver minhas reservas',
                'Sair'
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
                await this.visualizarDados(usuario, 'Cliente');
            }
            else if (answers.op === opcoes[1]){
                //this.listarQuartos();
            }
            else if (answers.op === opcoes[2]){
                //this.fazerReserva(usuarioObj, quartoObj, reservasLista);
            }
            else if (answers.op === opcoes[3]){
                //this.cancelar reservar(reserva, reservasList);
            }
            else if (answers.op === opcoes[4]){
                //this.mudarStatusReserva();
            }
            else if (answers.op === opcoes[4]){
                //this.listarReservas(Usuario);
            }
            else if (answers.op === opcoes[5]){
                await this.exibirTelaInicial(); // Volta pra tela inicial
            }
            else {
                throw new Error('Erro inesperado.')
            }
        } catch (error) { 
            console.error(`Erro: ${error.message}`);
        }
    }

    // Visualizar dados do usuario
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
                console.log(`Nascimento: ${usuario.nascimento}`);
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
                    // atualiza o objeto no banco de dado
                    await BDManager.atualizarObjeto((tipoDeUsuario === 'Funcionario') ? 'funcionarios' : 'clientes', usuario);            
                    // Volta pro menu de visualizacao com o usuario atualizado
                    await this.visualizarDados(usuario, tipoDeUsuario);
                }
            });
        }
        catch (error) { 
            console.error(`Erro: ${error.message}`);
        }
    }

    // Adicioanr quarto a lista de quartos
    async adicionarQuarto(usuario) {

        console.clear() // Limpa o terminal
        Cabecalho.exibir('Adicionar novo quartos'); // Exibe o cabecalho

        let quarto = new Quarto; // Instancia um novo objeto Quarto
        let tabela = this.obterTabela('Quarto'); // Pega a versao mais recente da tabela no banco de dados
        let ids = [];
        for (let i=0; i < tabela.length; i++) {
            listaIds.push(tabela[i].id);
        }

        quarto.id = ID.gerar('Q', ids);
        let sucesso = false;

        // Formulario de criacao de conta
        while (true) {
            try {
                if (!await this.perguntarNomeQuarto(quarto)) {
                    await this.menuFuncionarioLogado(usuario);
                    break;
                }
                if (!await this.perguntarQuantidadeCamas(quarto)) {
                    await this.menuFuncionarioLogado(usuario);
                    break;
                }
                if (!await this.perguntarPreco(quarto)) {
                    await this.menuFuncionarioLogado(usuario);
                    break;
                }
                if (!await this.perguntarDescricao(quarto)) {
                    await this.menuFuncionarioLogado(usuario);
                    break;
                }

                await this.publicarDado('quartos', quarto); // Publica o quarto no banco de dados
                sucesso = true;
                break;
            }
            catch(err) {
                console.log("Error: ", err);
            }
        }
        if (sucesso) await this.menuFuncionarioLogado(usuario); // Ao terminar de criar conta vai para tela de login
    }

    // Retorna a tabela das classes
    async obterTabela(tabela) {
        if (tabela === 'Funcionario') return await BDManager.obterTabela('funcionarios');
        else if (tabela === 'Cliente') return await BDManager.obterTabela('clientes');
        else if (tabela === 'Quarto') return await BDManager.obterTabela('quartos');
        else if (tabela === 'Reserva') return await BDManager.obterTabela('reservas');
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

    // Esperar tantos segundos
    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Iniciar sistema
const FLuxoHotel = new Sistema();
FLuxoHotel.iniciar();