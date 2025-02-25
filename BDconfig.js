import { Cliente, Funcionario, Quarto, Reserva } from './classes.js';
import fs from 'fs';
import { createObjectCsvWriter as createCsvWriter, createObjectCsvStringifier } from 'csv-writer';
import csvParserModule from 'csv-parser';

const csvParser = csvParserModule; // Renomeia o cvParseModule

export class BDManager {

    // Le os arquivos que armazenam os dados do sistema
    static obterTabela(origem) {

        return new Promise((resolve, reject) => {
            let tabela = [];
            const caminho = `./banco_de_dados/${origem}.csv`;
            
            // Se o arquivo não existir, o cria
            if (!fs.existsSync(caminho)) {
                this.criarTabela(origem, caminho);
                resolve(tabela); // Retorna um array vazio, pois o arquivo acabou de ser criado
            } 
            else {
                fs.createReadStream(caminho)
                    .pipe(csvParser())
                    .on('data', (linha) => tabela.push(linha))
                    .on('end', () => {
                        resolve(tabela); // Retorna a lista de funcionários após a leitura
                    })
                    .on('error', (err) => {
                        console.error('Erro ao ler o arquivo CSV:', err);
                        reject(err); // Rejeita a Promise em caso de erro
                    });
            }
        });
    }

    static async publicarTabela(destino, tabela) {

        // Caminho do arquivo csv
        const caminho = `./banco_de_dados/${destino}.csv`

        // Configura o escritor CSV
        const csvWriter = this.obterCsvWriter(destino, caminho);

        // Verifica se o arquivo está vazio e escreve o cabeçalho se necessário
        if (!fs.existsSync(caminho)) {
            this.criarTabela(destino, caminho);
        }

        // Escreve os dados no arquivo CSV
        try {
            await csvWriter.writeRecords(tabela);
        } 
        catch (err) {
            console.error('Erro ao escrever no arquivo CSV:', err);
            throw err; // Lança o erro para ser tratado externamente
        }
    }

    static async publicarDado(destino, objeto) {
    
        let tabela = await this.obterTabela(destino);
    
        // Adiciona o objeto instanciado no banco de dados local
        tabela.push(objeto);
    
        // Commita as mudancas pro banco de dados
        try {
            await this.publicarTabela(destino, tabela);
        } 
        catch (err) {
            throw err;
        }
    }

    static async atualizarObjeto(tabela, obj) {
        // Ler o arquivo CSV
        const records = [];
        fs.createReadStream(`./banco_de_dados//${tabela}.csv`)
            .pipe(csvParser())
            .on('data', (linha) => records.push(linha))
            .on('end', async () => {
                // Encontrar a linha que precisa ser atualizada
                const index = records.findIndex(record => record.id === obj.id);
                if (index !== -1) {
                    // Atualizar a linha
                    records[index] = { ...records[index], ...obj };
    
                    // Criar o stringifier CSV

                    const csvStringifier = this.obterObjectCsvStringifier(tabela);
    
                    // Converter os registros de volta para CSV
                    const header = csvStringifier.getHeaderString();
                    const csvString = header + csvStringifier.stringifyRecords(records);
    
                    // Escrever o arquivo CSV novamente
                    fs.writeFileSync(`./banco_de_dados/${tabela}.csv`, csvString, 'utf8');
                } else {
                }
            });
    }

    static obterCsvWriter(tabela) {
        // Configura o escritor CSV 
        if (tabela === 'funcionarios') {
            return createCsvWriter({
                path: `./banco_de_dados/${tabela}.csv`, // Nome do arquivo de saída
                header: [
                    { id: 'id', title: 'id' },             // Coluna "ID"
                    { id: 'nome', title: 'nome' },         // Coluna "nome"
                    { id: 'usuario', title: 'usuario' },   // Coluna "usuario"
                    { id: 'cpf', title: 'cpf' },           // Coluna "cpf"
                    { id: 'email', title: 'email' },       // Coluna "email"
                    { id: 'senha', title: 'senha' },       // Coluna "senha"
                ],
            });
        }
        else if (tabela === 'clientes') 
            return createCsvWriter({
                path: `./banco_de_dados/${tabela}.csv`, // Nome do arquivo de saída
                header: [
                    { id: 'id', title: 'id' },                   // Coluna "ID"
                    { id: 'nome', title: 'nome' },               // Coluna "nome"
                    { id: 'nascimento', title: 'nascimento' },   // Coluna "nascimento"
                    { id: 'cpf', title: 'cpf' },                 // Coluna "cpf"
                    { id: 'email', title: 'email' },             // Coluna "email"
                    { id: 'senha', title: 'senha' },             // Coluna "senha"
                ],
            });
        else if (tabela === 'quartos') 
            return createCsvWriter({
                path: `./banco_de_dados/${tabela}.csv`, // Nome do arquivo de saída
                header: [
                    { id: 'id', title: 'id' },                     // Coluna "id"
                    { id: 'nome', title: 'nome' },                 // Coluna "nome"
                    { id: 'camas', title: 'camas' },               // Coluna "camas"
                    { id: 'preco', title: 'preco' },               // Coluna "preco"
                    { id: 'descricao', title: 'descricao' },       // Coluna "descricao"
                ],
            });
        else if (tabela === 'reservas') 
            return createCsvWriter({
                path: `./banco_de_dados/${tabela}.csv`, // Nome do arquivo de saída
                header: [
                    { id: 'id', title: 'id' },                  // Coluna "id"
                    { id: 'id_cliente', title: 'idCliente' },   // Coluna "idCliente"
                    { id: 'status', title: 'status' },          // Coluna "status"
                    { id: 'entrada', title: 'entrada' },        // Coluna "entrada"
                    { id: 'saida', title: 'saida' },            // Coluna "saida
                ],
            });
    } 

    static obterObjectCsvStringifier(tabela) {
        // Configura o escritor CSV 
        if (tabela === 'funcionarios') {
            return createObjectCsvStringifier({
                header: [
                    { id: 'id', title: 'id' },
                    { id: 'nome', title: 'nome' },
                    { id: 'usuario', title: 'usuario' },
                    { id: 'cpf', title: 'cpf' },
                    { id: 'email', title: 'email' },
                    { id: 'senha', title: 'senha' },
                ]
            });
        }
        else if (tabela === 'clientes') 
            return createObjectCsvStringifier({
                header: [
                    { id: 'id', title: 'id' },
                    { id: 'nome', title: 'nome' },
                    { id: 'nascimento', title: 'nascimento' },
                    { id: 'cpf', title: 'cpf' },
                    { id: 'email', title: 'email' },
                    { id: 'senha', title: 'senha' },
                ]
            });
            
        else if (tabela === 'quartos') 
            return createObjectCsvStringifier({
                header: [
                    { id: 'id', title: 'id' },
                    { id: 'nome', title: 'nome' },
                    { id: 'camas', title: 'camas' },
                    { id: 'preco', title: 'preco' },
                    { id: 'descricao', title: 'descricao' },
                ]
            });
        
        else if (tabela === 'reservas') 
            return createObjectCsvStringifier({
                header: [
                    { id: 'id', title: 'id' },
                    { id: 'id_cliente', title: 'idCliente' },
                    { id: 'status', title: 'status' },
                    { id: 'entrada', title: 'entrada' },
                    { id: 'saida', title: 'saida' },
                ]
            });
    }

    static criarTabela(destino, caminho) {
        switch (destino) {
            case 'funcionarios': 
                fs.writeFileSync(caminho, "id,nome,usuario,cpf,email,senha\n", 'utf8');
                break;
            case 'clientes':
                fs.writeFileSync(caminho, "id,nome,nascimento,cpf,email,senha\n", 'utf8');
                break;
            case 'quartos':
                fs.writeFileSync(caminho, "id,nome,camas,preco,descricao\n", 'utf8');
                break;
            case 'reservas':
                fs.writeFileSync(caminho, "id,idCliente,status,entrada,saida\n", 'utf8');
                break;
        }
    }
}