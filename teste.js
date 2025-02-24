// let funcionarios_id_list = [];
// let funcionarios_bd = [];

// // [
// //     {
// //       id: 'FNC8311',
// //       nome: 'Pedro',
// //       usuario: 'xxpedroca',
// //       cpf: '05533991794',
// //       email: 'pedro@gmail.com',
// //       senha: 'pedrox'
// //     },
// //     {
// //       id: 'FNC4198',
// //       nome: 'Thiago Oliveira',
// //       usuario: 'xxthiago',
// //       cpf: '21026174759',
// //       email: 'thiago@gmail.com',
// //       senha: 'thiago1547'
// //     }
// //   ];

// for (let i = 0; i < funcionarios_bd.length; i++) {
//     funcionarios_id_list.push(funcionarios_bd[i].id);
// }

// console.log(funcionarios_id_list);

class MinhaClasse {
    static metodoA() {
      console.log("Chamando método A");
    }
  
    static metodoB() {
      this.metodoA(); // Chama métodoA dentro da mesma classe
      console.log("Chamando método B");
    }
  }
  
MinhaClasse.metodoB();   