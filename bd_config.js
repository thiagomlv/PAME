import fs from 'fs';
import { createObjectCsvWriter as createCsvWriter, createObjectCsvStringifier } from 'csv-writer';
import csvParserModule from 'csv-parser';

const csvParser = csvParserModule; // Renomeia o cvParseModule

export class BDManager {

    // Caminho para o arquivo de bd
    static funcionariosBdPath = './bd/funcionarios.csv';

    // Le os arquivos que armazenam os dados do sistema
    static obterTabela(tabela) {

        return new Promise((resolve, reject) => {
            let tabelaLista = [];
            const tabelaCaminho = this.obterCaminho(tabela);
            
            // Se o arquivo não existir, o cria
            if (!fs.existsSync(tabelaCaminho)) {
                fs.writeFileSync(tabelaCaminho,'', 'utf8'); // Cria o arquivo 
                resolve(tabelaCaminho); // Retorna um array vazio, pois o arquivo acabou de ser criado
            } 
            else {
                fs.createReadStream(this.funcionariosBdPath)
                    .pipe(csvParser())
                    .on('data', (linha) => this.funcionarios.push(linha))
                    .on('end', () => {
                        resolve(this.funcionarios); // Retorna a lista de funcionários após a leitura
                    })
                    .on('error', (err) => {
                        console.error('Erro ao ler o arquivo CSV:', err);
                        reject(err); // Rejeita a Promise em caso de erro
                    });
            }
        });
    }

    static async publicarBD(tabela) {

        caminhoTabela = this.obterCaminho(tabela);

        // Configura o escritor CSV
        const csvWriter = this.obterCsvWriter(tabela, caminhoTabela)

        // Verifica se o arquivo está vazio e escreve o cabeçalho se necessário
        if (!fs.existsSync(caminhoTabela) || fs.readFileSync(caminhoTabela, 'utf8').trim() === '') {
            await csvWriter.writeRecords([]); // Isso escreve o cabeçalho
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

    static async atualizarPessoa(path, objPessoa) {
        // Ler o arquivo CSV
        const records = [];
        fs.createReadStream(path)
            .pipe(csvParser())
            .on('data', (linha) => records.push(linha))
            .on('end', async () => {
                // Encontrar a linha que precisa ser atualizada
                const index = records.findIndex(record => record.id === objPessoa.id);
                if (index !== -1) {
                    // Atualizar a linha
                    records[index] = { ...records[index], ...objPessoa };
    
                    // Criar o stringifier CSV
                    const csvStringifier = createObjectCsvStringifier({
                        header: [
                            { id: 'id', title: 'id' },
                            { id: 'nome', title: 'nome' },
                            { id: 'usuario', title: 'usuario' },
                            { id: 'cpf', title: 'cpf' },
                            { id: 'email', title: 'email' },
                            { id: 'senha', title: 'senha' },
                        ]
                    });
    
                    // Converter os registros de volta para CSV
                    const header = csvStringifier.getHeaderString();
                    const csvString = header + csvStringifier.stringifyRecords(records);
    
                    // Escrever o arquivo CSV novamente
                    fs.writeFileSync(path, csvString, 'utf8');
                } else {
                }
            });
    }

    static obterCaminho(dadoRequerido) {
        if (dadoRequerido === 'Funcionario') return './bd/funcionarios.csv'
        else if (dadoRequerido === 'Cliente') return './bd/clientes.csv'
        else if (dadoRequerido === 'Quartos') return './bd/quartos.csv'
        else if (dadoRequerido === 'Reservas') return './bd/reservas.csv'
    }

    static obterCsvWriter(dadoRequerido, caminhoTabela) {
        // Declara o escritor CSV 
        let csvWriter;

        // Configura o escritor CSV 
        if (dadoRequerido === 'Funcionario') {
            csvWriter = createCsvWriter({
                path: caminhoTabela, // Nome do arquivo de saída
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
        else if (dadoRequerido === 'Cliente') 
            csvWriter = createCsvWriter({
                path: caminhoTabela, // Nome do arquivo de saída
                header: [
                    { id: 'id', title: 'id' },                   // Coluna "ID"
                    { id: 'nome', title: 'nome' },               // Coluna "nome"
                    { id: 'nascimento', title: 'nascimento' },   // Coluna "usuario"
                    { id: 'cpf', title: 'cpf' },                 // Coluna "cpf"
                    { id: 'email', title: 'email' },             // Coluna "email"
                    { id: 'senha', title: 'senha' },             // Coluna "senha"
                ],
            });
        else if (dadoRequerido === 'Quartos') 
            csvWriter = createCsvWriter({
                path: caminhoTabela, // Nome do arquivo de saída
                header: [
                    { id: 'id', title: 'id' },                     // Coluna "id"
                    { id: 'nome', title: 'nome' },                 // Coluna "nome"
                    { id: 'camas', title: 'camas' },               // Coluna "camas"
                    { id: 'preco', title: 'preco' },               // Coluna "preco"
                    { id: 'descricao', title: 'descricao' },       // Coluna "descricao"
                ],
            });
        else if (dadoRequerido === 'Reservas') 
            csvWriter = createCsvWriter({
                path: caminhoTabela, // Nome do arquivo de saída
                header: [
                    { id: 'id', title: 'id' },                  // Coluna "id"
                    { id: 'id_cliente', title: 'idCliente' },   // Coluna "idCliente"
                    { id: 'status', title: 'status' },          // Coluna "status"
                    { id: 'entrada', title: 'entrada' },        // Coluna "entrada"
                    { id: 'saida', title: 'saida' },            // Coluna "saida
                ],
            });

        return csvWriter
    } 
}

// Exemplo de uso
BDManager.atualizarPessoa('./bd/funcionarios.csv', {
    id: 'FN3427',
    nome: 'Lucas',
    usuario: 'xxtigas',
    cpf: '21026174759',
    email: 'tigas@gmail.com',
    senha:'12345'
});