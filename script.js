const estadoDoJogo = [
  ['', '', '', '', ''], 
  ['', '', '', '', ''], 
  ['', '', '', '', ''], 
  ['', '', '', '', ''], 
  ['', '', '', '', ''], 
  ['', '', '', '', ''] 
];

const palavraSecreta = ['P', 'R', 'A', 'T', 'O'];

let tentativaAtual = 0; 

function bloquearInputsClassificados() {

    const todasAsLetras = document.querySelectorAll('.letra');
    todasAsLetras.forEach(input => {
        if (
            input.classList.contains('correta') ||
            input.classList.contains('espera') ||
            input.classList.contains('presente') ||
            input.classList.contains('ausente')
        ) {
            input.disabled = true;
        }
        else {
            input.disabled = false;
        }
    });
}

function verificarStatus() {
    const inputs = document.querySelectorAll(`#L${tentativaAtual} .letra`);
    
    let status = [];

    let status_do_jogo = true;
    
    inputs.forEach((input, index) => {
        const letraDigitada = input.value.toUpperCase();
        const letraSecreta = palavraSecreta[index];      

        if (letraDigitada === letraSecreta) {
            input.classList.add('correta');
            status.push('correta');
        } else if (palavraSecreta.includes(letraDigitada)) {
            input.classList.add('presente');
            status.push('presente');
            status_do_jogo = false;
        } else {
            input.classList.add('ausente');
            status.push('ausente');
            status_do_jogo = false;
        }
    });
    
    if(!status_do_jogo){
        estadoDoJogo[tentativaAtual] = status;
    }

    return status_do_jogo;
}

function focoInput(){
    const inputs = document.querySelectorAll(`#L${tentativaAtual} .letra`);

    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (event) => {
            const inputAtual = event.target;
            
            

            if (inputAtual.value.length === inputAtual.maxLength) {
                
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });
    });
}

function focoDeletar(){
    const inputs = document.querySelectorAll(`#L${tentativaAtual} .letra`);

    inputs.forEach((input, index)=> {
        input.addEventListener('keyup', (event) =>{
            const inputAtual = event.target;

            if(event.key === 'Backspace' && inputAtual.value.length === 0){
                const inputAnterior = inputAtual.previousElementSibling;

                if (inputAnterior){
                    inputAnterior.focus();
                }
            }
        })

    })
}

function limpar (){
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
        input.value = '';
    })
}

function reinicializarLinha(tentativaAtual) {
	const inputs = document.querySelectorAll(`#L${tentativaAtual} .letra`);
	
    inputs.forEach((input, index) => {
        input.classList.remove('espera');
    });

    focoInput();
    focoDeletar();
}

// Adiciona o evento para a tecla Enter (verifica se a palavra é correta)
document.addEventListener('keydown', (e) => {
	
    // Verifica se a tecla pressionada foi Enter
    if (e.key === 'Enter') {
        const inputs = document.querySelectorAll(`#L${tentativaAtual} .letra`);
        
        // Se todas as letras forem digitadas, verifica o status
        if (
				inputs[0].value !== '' &&
				inputs[1].value !== '' &&
				inputs[2].value !== '' &&
				inputs[3].value !== '' &&
				inputs[4].value !== ''
			) {
			
            // Verifica o status da tentativa
            let status_do_jogo = verificarStatus();

            // Desativa todos os inputs do jogo caso tenha terminado
            if(status_do_jogo){
                document.querySelectorAll('.letra').forEach(elemento => elemento.disabled = true);
                return; // PARA O JOGO
            }

            // Se a tentativa atual não for a última, vai para a próxima linha
            if (tentativaAtual < 5) {
                tentativaAtual++;
                letraAtual = 0; // Reinicia a coluna
				reinicializarLinha(tentativaAtual);
                bloquearInputsClassificados();
                document.querySelector(`#L${tentativaAtual} .letra`).focus(); // Foca na primeira letra da nova linha
            }
        }
    }
});

// Eventos do Teclado Virtual, criados após o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    focoInput();
    focoDeletar();
    bloquearInputsClassificados();
    limpar();

    // Acrescentando evento de clique a cada LETRA do teclado virtual
    document.querySelectorAll('.teclado').forEach(botao =>{
        botao.addEventListener('click', () => {

            const letra = botao.textContent.trim().toUpperCase();
            const inputs = document.querySelectorAll(`#L${tentativaAtual} .letra`);


            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].value === '' && !inputs[i].disabled) {
                    inputs[i].value = letra;
                    break;
                }
            }
        });
    });

    // ENTER simples
    const enter = document.querySelector('#teclado-do-jogo .enter');
    if (enter) enter.addEventListener('click', () => {

        // Criando um evento que simula o pressionamento da tecla Enter
        const eventoEnter = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(eventoEnter);        
    });

    // DELETE simples
    const deletar = document.querySelector('#teclado-do-jogo .backspace');
    if (deletar) deletar.addEventListener('click', () => {

        const inputs = document.querySelectorAll(`#L${tentativaAtual} .letra`);
        for (let i = inputs.length - 1; i >= 0; i--) {
            if (inputs[i].disabled) continue;

            if (inputs[i].value !== '') {
                inputs[i].value = '';
                break;
            }
        }
    });
});