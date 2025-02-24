import inquirer from 'inquirer';
import { Cabecalho, CPF, ValidarContaFuncionario, ValidarData, Formatar, ID } from './funcoes_auxiliares.js';
import fs from 'fs';
import { Funcionario } from './2.funcionario.js'
import { BDManager } from './bd_config.js';

class Sistema {

    // Banco de dados 
    funcionarios_bd = []; 
    clientes_bd = []; 
    reservas_bd = [];
    quartos_bd = [];

    // Metodo inicial: é chamado para iniciar o sistema
    async iniciar() {
        this.exibirTelaInicial();
    }

    async addNovoFuncionario(dados_funcionario) {
        // Instancia um objeto funcionario
        const funcionario = new Funcionario(
            dados_funcionario.id, 
            dados_funcionario.nome, 
            dados_funcionario.usuario, 
            dados_funcionario.cpf, 
            dados_funcionario.email, 
            dados_funcionario.senha)

        // Pega a versao mais recente do banco de dados
        this.funcionarios_bd = await BDManager.obterFuncionarios();

        // Adiciona o usuario instanciado no bando de dados local
        this.funcionarios_bd.push(funcionario);

        // Commita as mudanas pro arquivo bd
        try {
            await BDManager.publicarFuncionarios(this.funcionarios_bd);
            console.log(await BDManager.obterFuncionarios())
        } 
        catch (err) {
            // Chama o menu de erro;
        }
    }

    // Função que exibe a primeira tela do sistema
    exibirTelaInicial() {
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
        this.selecionarTipoDeUsuario();
    }

    // Selecionar modo do usuario entre Funcionario e Cliente
    selecionarTipoDeUsuario() {
        inquirer
            .prompt([
                {
                    type:  'list',
                    name: 'tipoDeUsuario',
                    message: 'Entrar como:\n',
                    choices:['Funcionario', 'Cliente'],
                }
            ],)
            .then((answers) => {
                this.selecionarModoDeEntrada(answers.tipoDeUsuario); // Chama a funcao para selecionar modo de entrada
            })
            .catch((error) => {
                if (error.name === 'ExitPromptError') console.log('\nO usuário forçou o fechamento do aplicativo.');
                else console.log(`Ocorreu um erro: ${error}`);
            });
    }

    // Selecionar modo de entrada: Logar numa conta existente ou criar uma nova conta
    selecionarModoDeEntrada(tipoDeUsuario) {
        // Limpa o terminal
        console.clear();

        // Exibicao do cabecalho se o usuario for um funcionario
        if (tipoDeUsuario === 'Funcionario') Cabecalho.exibir('AREA DO FUNCIONARIO');
        else Cabecalho.exibir('AREA DO CLIENTE');

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
            .then((answers) => {
                console.clear();
                if (answers.modoDeEntrada === 'Entrar na minha conta'); //acessarConta(answers.modoDeEntrada);
                else if ((answers.modoDeEntrada === 'Criar uma conta'))
                    this.criarConta(tipoDeUsuario);
            })
            .catch((error) => {
                if (error.name === 'ExitPromptError') console.log('\nO usuário forçou o fechamento do aplicativo.');
                else console.log(`Ocorreu um erro: ${error}`);
            });
    }

    async criarConta(tipoDeUsuario) {

        // dados de cadastro
        let dados_funcionario = (tipoDeUsuario ===  'Funcionario') ? 
            {
                id: '',
                nome: '',
                usuario: '',
                cpf: '',
                email: '',
                senha: '',
            } :
            {
                id: '',
                nome: '',
                nascimento: '',
                cpf: '',
                email: '',
                senha: '',
            }

        

        let id_list = [];
        if ()
        for (let i = 0; i < funcionarios_bd.length; i++) {
            id_list.push(funcionarios_bd[i].id);
        }

        // Atribuindo um id
        dados_funcionario.id = ID.gerar('F', funcionarios_id_list);

        // Formulario de criacao de conta
        await this.perguntarNome(tipoDeUsuario, dados_funcionario);
        await this.perguntarUser(tipoDeUsuario, dados_funcionario);
        await this.perguntarCPF(tipoDeUsuario, dados_funcionario);
        await this.perguntarEmail(tipoDeUsuario, dados_funcionario);
        await this.perguntarSenha(tipoDeUsuario, dados_funcionario);
    }

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
                if ( await this.confirmarDados('nome completo') ) {
                    dados.nome = Formatar.nome(answers.nomeCompleto); 
                    break; // Sai do loop se o nome de usuário for válido
                }
                else {
                    break;
                }

            } 
            catch (error) {
                console.error(`Erro: ${error.message}`);
            }
        }
    }

    // Campo: Nome de usuario
    async perguntarUser(tipoDeUsuario, dados) {
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
                            const apenasNumeros = input.replace(/\D/g, '');
                            if ( ! ValidarContaFuncionario.nomeUsuario(input, this.funcionarios_bd) ) return '\n O nome de usuaria nao esta disponivel.';
                            return true;
                        },
                    },
                ]);

                // Confirmar dados
                if ( await this.confirmarDados('nome de usuario') ) {
                    dados.usuario = answers.nomeUsuario;
                    break; // Sai do loop se o nome de usuário for válido
                }
                else {
                    continue;
                }

            } catch (error) { 
                console.error(`Erro: ${error.message}`);
            }
        }
    }

    // Campo: CPF
    async perguntarCPF(tipoDeUsuario, dados) {
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
                            const apenasNumeros = input.replace(/\D/g, '');
                            if (apenasNumeros.length > 11) return '\nO CPF deve ter no máximo 11 números.';
                            if (apenasNumeros.length < 11) return '\nO CPF deve ter exatamente 11 números.';
                            if ( ! CPF.validar(input) ) return '\nCPF inválido.';
                            return true;
                        },
                        filter: (input) => input.replace(/\D/g, '').slice(0, 11), // Remove caracteres inválidos
                    },
                ]);

                // Confirmar dados
                if ( await this.confirmarDados('CPF') ) {
                    dados.cpf = answers.cpf;
                    console.log(dados);
                    break; // Sai do loop se o nome de usuário for válid
                }
                else {
                    continue;
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
                if ( await this.confirmarDados('email') ) {
                    dados.email = answers.email;
                    break; // Sai do loop se o nome de usuário for válid
                }
                else {
                    continue;
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
                    console.log('\nAs senha nao coincidem.');
                    continue;
                }
                else {
                    dados.senha = answers.senha_2;
                    await this.addNovoFuncionario(dados) // Cadastra o usuario no sistema ao final do sign up
                    break; // Sai do loop se o nome de usuário for válid
                }             
            } 
            catch (error) {
                console.error(`Erro do tipo: ${error.message}`);
                break;
            }
        }
    }

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
                        choices: ['Confirmar', 'Editar']
                    },
                ]);

                // Verifica se o nome de usuario já existe no sistema
                if (answers.confirmacao === 'Confirmar') {
                    console.log('======= Entrei =======');
                    return true;
                }  
                else if (answers.confirmacao === 'Editar') return false;
                else throw new Error()

            } catch (error) {
                console.error(`Erro: ${error.message}`);
            }
        }
    }

    // Selecionar modo do usuario entre Funcionario e Cliente
    ConfirmarProsseguirComCadastro() {

        Cabecalho.exibir('Usuario reconhecido')

        inquirer
            .prompt([
                {
                    type:  'list',
                    name: 'opcao',
                    message: 'Deseja fazer login no sistema ou voltar para criacao de conta?:\n',
                    choices:['Login', 'Criar conta'],
                }
            ],)
            .then((answers) => {
                this.selecionarModoDeEntrada(answers.tipoDeUsuario); // Chama a funcao para selecionar modo de entrada
            })
            .catch((error) => {
                if (error.name === 'ExitPromptError') console.log('\nO usuário forçou o fechamento do aplicativo.');
                else console.log(`Ocorreu um erro: ${error}`);
            });
    }
}


const FLuxoHotel = new Sistema();
FLuxoHotel.iniciar();


// await FLuxoHotel.addNovoFuncionario({
//     id: ID.gerar('FN', []),
//     nome: 'Thiago',
//     usuario: 'xxtigas',
//     cpf: '21026174759',
//     email: 'tigas@gmail.com',
//     senha:'12345'
// });