# PAME 24.2.2

Esse repositório contém o projeto desenvolvido para o processo seletivo da Fluxo Consultoria em Fevereiro de 2025.

## Como usar este repositório

### 1. Clonar o repositório

    git clone git@github.com:thiagomlv/PAME.git
    cd PAME

### 2. Dependencias

O projeto usa as bibliotecas inquirer, csv-parser e csv-writer. Garanta que elas estão instaladas antes de rodar o código.

    npm i csv-parser
    npm i csv-writer
    npm i inquirer

Verifique a instalação com

    npm ls

## Estrutura do diretório

```
    PAME/
    ├── banco_de_dados/
    │   └── .gitignore
    ├── sistema.js
    ├── classes.js
    ├── BDconfig.js
    └── funcoesAuxiliares.js

```

## Descrição dos arquivos

- **sistema.js**:  Contém a classe Sistema, que gerencia toda aplicação.
- **classes.js**: Contém a definição das classes Funcionario, Cliente, Quarto e Reserva.
- **BDConfig.js**: Contém a classe BDManager, que cuida de armazenar os dados do sistema em arquivos csv.
- **funcoesAuxiliares.js**: Contém definições de classes auxiliares, com métodos estáticos, para serem usados principalmente na classe Sistema.
