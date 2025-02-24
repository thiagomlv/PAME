export class AlreadyExistsError extends Error {
    constructor(message, dado) {
        super(message); // Chama o construtor da classe Error
        this.name = `${dado}AlreadyExist.`; // Define o nome do erro
    }
}

export class FullNameError extends Error {
    constructor(message='O nome não pode ser nulo.') {
        super(message); // Chama o construtor da classe Error
        this.name = 'NullFullName.'; // Define o nome do erro
    }
}