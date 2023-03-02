/////** Parte 2 **/////

//Classe que vai dar origem às validações.
//Constructor com as propriedades do objeto criado.
//Array para mapear e percorrer todas as validações do projeto.
class Validator {
  constructor() {
    this.validations = [
      'data-required',
      'data-email-validate',
      'data-only-letters',
      'data-min-length',
      'data-max-length',
      'data-password-validate',
      'data-equal'
    ]
  }

  /////** Parte 3 **///// Processos para acessar e poder verificar as validações dos inputs do formulário:

  errorCount = 0

  validate(form) {
    //Resgata todas as validações erradas e se tiver alguma presente na tela, limpar após usuário corrigir:
    let currentValidations = document.querySelectorAll('form .error-validation')

    if (currentValidations.length > 0) {
      this.clearValidations(currentValidations)
    }

    //Pegar todos os inputs:
    let inputs = form.getElementsByTagName('input')

    //Para fazer o loop nos inputs é necessário transformar HTML collection em Array. Método abaixo:
    let inputsArray = [...inputs]

    /////** Parte 4 **///// LOOP NOS INPUTS E NAS VALIDAÇÕES:

    //LOOP NOS INPUTS analisando o conteúdo encontrado em cada índice:
    inputsArray.forEach(function (input) {
      //LOOP NAS VALIDAÇÕES analisando as condições definidas:
      for (let i = 0; this.validations.length > i; i++) {
        //Pegar no índice atual do loop o valor que está no input. Para então verificar se está ou não, de acordo com as validações definidas:
        if (input.getAttribute(this.validations[i]) != null) {
          //Limpando uma string para virar um método.
          //Substituindo o nome dos atributos da tag input HTML, por nome dos Métodos de verificação:
          let method = this.validations[i].replace('data-', '').replace('-', '')

          //Valor do input em uma variável, para manipular quando necessário:
          let value = input.getAttribute(this.validations[i])

          //Invocar o método para informar qual input do loop está sendo validado e qual seu valor para ser analisado:
          this[method](input, value)
        }
      }
    }, this)
    return this.errorCount
  }

  /////** Parte 5 **///// MÉTODOS DE VERIFICAÇÕES:

  //Verificação 1: Verifica se o input é requerido:

  required(input) {
    let inputValue = input.value
    if (inputValue === '') {
      let errorMessage = '*This field is required.'

      this.printMessage(input, errorMessage)
      return this.errorCount++
    }
  }

  //Verificação 2: Aplicando Regex no input do email:
  emailvalidate(input) {
    let re = /\S+@\S+\.\S+/

    let email = input.value

    let errorMessage = `*Please, insert your email. Ex: email@email.com`

    if (!re.test(email)) {
      this.printMessage(input, errorMessage)
      return this.errorCount++
    }
  }

  //Verificação 3: Verifica se o input tem apenas letras:
  onlyletters(input) {
    let re = /^[A-Za-z]+$/

    let inputValue = input.value

    let errorMessage = `*This field only accepts letters.`

    if (!re.test(inputValue)) {
      this.printMessage(input, errorMessage)
      return this.errorCount++
    }
  }

  // Verificação 4: Verifica se o input tem o número mínimo de caracteres definido para os inputs:
  minlength(input, minValue) {
    let inputLength = input.value.length

    let errorMessage = `*This field must have at least ${minValue} characters.`

    if (inputLength < minValue) {
      this.printMessage(input, errorMessage)
      return this.errorCount++
    }
  }

  // Verificação 5: Verifica se o input tem o número máximo de caracteres definido para os inputs:
  maxlength(input, maxValue) {
    let inputLength = input.value.length

    let errorMessage = `*This field must be a maximum of ${maxValue} characters.`

    if (inputLength > maxValue) {
      this.printMessage(input, errorMessage)
      return this.errorCount++
    }
  }

  //Verificação 6: Verifica se o input de senha está conforme o método e comportamento definido:
  passwordvalidate(input) {
    //Transforma string em um Array:
    let charArray = input.value.split('')

    //contador de letras maiúsculas e números:
    let uppercases = 0
    let numbers = 0
    //loop para percorrer todos os caracteres:
    for (let i = 0; charArray.length > i; i++) {
      //se a letra atual do loop for maiúsculo && se o char for número (Porem, é necessário transformar o número no tipo number)
      if (
        charArray[i] === charArray[i].toUpperCase() &&
        isNaN(parseInt(charArray[i]))
      ) {
        uppercases++
      } else if (!isNaN(parseInt(charArray[i]))) {
        numbers++
      }
    }

    if (uppercases === 0 || numbers === 0) {
      let errorMessage = `*It needs 1 uppercase letter and 1 number.`

      this.printMessage(input, errorMessage)
      return this.errorCount++
    }
  }

  //Verificação 7: Verifica se 2 campos de inputs são iguais(Confirm Password):
  equal(input, inputName) {
    let inputToCompare = document.getElementsByName(inputName)[0]

    let errorMessage = `*This field need be equal ${inputName}.`

    if (input.value != inputToCompare.value) {
      this.printMessage(input, errorMessage)
      this.errorCount++
    }
  }

  ///** PARTE 6 **/// PARA IMPRIMIR E REMOVER MENSAGEM DE ERRO NA TELA:

  //Para IMPRIMIR mensagem de erro na tela:
  printMessage(input, msg) {
    //Quantidade de erros que o input possui:
    let errorsQty = input.parentNode.querySelector('.error-validation')
    //Se a quantidade de erros for nulo, se não tiver nenhum erro na tela, pode imprimir erro, e se tiver erro na tela, não imprima outro.
    if (errorsQty === null) {
      let template = document.querySelector('.error-validation').cloneNode(true)

      template.textContent = msg

      // Acessando o input Pai, para a frase ficar fora do input.
      let inputParent = input.parentNode

      template.classList.remove('template')

      inputParent.appendChild(template)
    }
  }

  //Para REMOVER as mensagens de erros da tela:
  clearValidations(validations) {
    validations.forEach(el => el.remove())
    this.errorCount = 0
  }
} ///////////////FINAL DA FUNÇÃO PRINCIPAL/////////////////////

///** PARTE 1 **/// Mapear o formulário e o botão de submit. Para passar o evento de click e ativar a validação:

//Variáveis e método para acessar os elementos:
let form = document.getElementById('register-form')
let submit = document.getElementById('btn-submit')

//Para iniciar o objeto validator:
let validator = new Validator()
//Adicionando evento de click no botão. Para fazer as validações em cada input e enviar mensagem de erro:
submit.addEventListener('click', function (e) {
  e.preventDefault() //Impede o formulário de fazer sua função padrão de enviar os dados para o servidor validar.

  result = validator.validate(form)

  if (result === 0) {
    console.log('Deu Boa!')
    window.location.href = 'https://github.com/CaioEspindola'
  }
})
