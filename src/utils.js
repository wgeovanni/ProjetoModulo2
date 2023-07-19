//Classe utilizada para validações de campos

class Utils {

    // Função para verificar se uma string possui uma determinada quantidade de caracteres.
    // Recebe uma string e dois inteiros como parâmetros, sendo respectivamente:
    // A string a ser verificada, a quantidade mínima e a quantidade máxima de caracteres.
    // Devolve true ou false
    validateStringLenght(value, valueMin, valueMax) {
        const regex = new RegExp(`^.{${valueMin},${valueMax}}$`)
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se uma string contém somente letras.
    // Recebe uma string como parâmetro e devolve true ou false
    validateOnlyLetters(value) {
        const regex = /^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se uma string contém somente números.
    // Recebe uma string como parâmetro e devolve true ou false
    validateOnlyNumbers(value) {
        const regex = /^[0-9]+$/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se uma string contém pelo menos uma letra maiúscula.
    // Recebe uma string como parâmetro e devolve true ou false
    validateOneUpperLetter(value) {
        const regex = /.*[A-Z].*/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se uma string contém pelo menos um número.
    // Recebe uma string como parâmetro e devolve true ou false
    validateOneNumber(value) {
        const regex = /.*\d.*/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se uma string contém pelo menos um caractere especial.
    // Recebe uma string como parâmetro e devolve true ou false
    validateOneSpecialChar(value) {
        const regex = /.*[!@#$%^&*()].*/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se uma string não possui espaços.
    // Recebe uma string como parâmetro e devolve true ou false
    validateNoSpaces(value) {
        const regex = /.*\s.*/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se a data esta no modelo YYYY/MM/DD.
    // Recebe uma string como parâmetro e devolve true ou false.
    validateDate(value) {
        const regex = /^\d{4}\/(0[1-9]|1[012])\/(0[1-9]|1[0-9]|2[0-9]|3[01])$/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se o email esta no formato exemplo@email.com
    // Recebe uma string como parâmetro e devolve true ou false.
    validateEmail(value) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }

    // Função para verificar se o status inserido é exatamente os valores ATIVO ou INATIVO
    // Recebe uma string como parâmetro e devolve true ou false.
    validateStatus(value) {
        const regex = /^(Ativo|Inativo)$/
        if (regex.test(value)) {
            return true
        } else {
            return false
        }
    }
}

// Exportação da instanciação da classe
module.exports = new Utils();


