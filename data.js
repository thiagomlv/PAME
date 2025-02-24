import inquirer from 'inquirer';
import { ValidarData } from './funcoes_auxiliares.js';

// Pergunta primeiro o ano e o mês
inquirer
  .prompt([
    {
      type: 'list',
      name: 'anoNascimento',
      message: 'Selecione o ano do seu nascimento:\n',
      choices: ValidarData.anos,
    },
    {
      type: 'list',
      name: 'mesNascimento',
      message: 'Selecione o mês do seu nascimento:\n',
      choices: ValidarData.meses,
    },
  ])
  .then((answers) => {
    inquirer 
      .prompt([
        {
          type: 'list',
          name: 'diaNascimento',
          message: 'Selecione o dia do seu nascimento:\n' ,
          choices: ValidarData.obterDiasDoMes(answers.mesNascimento, answers.anoNascimento),
        }
      ])
      .then((answer) => {
        console.log(`Voce nasceu em ${answer.diaNascimento} de ${answers.mesNascimento} de ${answers.anoNascimento}`);
      });
  });
