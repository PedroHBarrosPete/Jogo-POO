// -------------- Base do jogo --------------
// 1. Capturar o elemento canvas pelo ID que definimos no HTML
const canvas = document.getElementById('telaJogo');

// 2. Extrair o contexto 2D, que nos dá acesso a funções de desenho (retângulos, linhas, etc)
const ctx = canvas.getContext('2d');


// -------------- Classes e objetos --------------

// Classe Base - ENCAPSULAMENTO --------------
class Entidade {
    
    // O construtor é chamado toda vez que criamos um 'new Entidade(...)'
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }

    // Método para desenhar a entidade no canvas
    desenhar() {
        ctx.fillStyle = this.cor;
        // Desenha um retângulo usando as propriedades do objeto
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }

    // Método genérico de atualização - Polimorfismo)
    atualizar() {
        // Por padrão, a entidade genérica não faz nada ao atualizar.
        this.desenhar();
    }
}



// NAVE / JOGADOR --------------

// Controle da nave
const teclas = {
    ArrowLeft: false,
    ArrowRight: false
};

// Quando a tecla é pressionada, marca como 'true'
window.addEventListener('keydown', (evento) => {
    if (teclas.hasOwnProperty(evento.code)) {
        teclas[evento.code] = true;
    }
});

// Quando a tecla é solta, marca como 'false'
window.addEventListener('keyup', (evento) => {
    if (teclas.hasOwnProperty(evento.code)) {
        teclas[evento.code] = false;
    }
});

// Subclasse jogador - HERANÇA
class Jogador extends Entidade {
    
    constructor(x, y, largura, altura, cor, velocidade) {
        // 'super' chama o construtor da classe base (Entidade)
        // 'this' configura x, y, largura, altura e cor automaticamente
        super(x, y, largura, altura, cor);
        
        // Atributo que define a velocidade de movimento do jogador
        this.velocidade = velocidade;
    }

    // POLIMORFISMO: Sobrescrevendo o método atualizar()
    atualizar() {
        // Lógica de movimento do jogador
        if (teclas.ArrowLeft && this.x > 0) {
            this.x -= this.velocidade; // Move para a esquerda
        }
        if (teclas.ArrowRight && this.x < canvas.width - this.largura) {
            this.x += this.velocidade; // Move para a direita
        }

        // Depois de atualizar a posição, chama o método herdado para se desenhar
        this.desenhar();
    }
}



// METEOROS CAINDO --------------
// Subclasse meteoro - HERANÇA
class Meteoro extends Entidade {
    
    constructor(x, y, largura, altura, cor, velocidadeY) {
        // Super() chama o construtor de Entidade
        super(x, y, largura, altura, cor);
        
        // Atributo que define a velocidade da queda do meteoro
        this.velocidadeY = velocidadeY;
    }

    // POLIMORFISMO: Outra versão do método atualizar()
    atualizar() {
        // A lógica do meteoro é simples: ele apenas cai na tela (aumenta o Y)
        this.y += this.velocidadeY;
        
        // Depois de atualizar a posição, chama o desenhar
        this.desenhar();
    }
}


// -------------- Instanciando os Objetos --------------

// Criação do objeto 'jogador' instanciado a partir da classe Jogador.
// (x: 225, y: 600, largura: 50, altura: 50, cor: 'blue', velocidade: 5)
const jogador = new Jogador(225, 600, 50, 50, 'blue', 5);

// Um array vazio para armazenar os múltiplos objetos da classe Meteoro
const meteoros = [];



// -------------- Gerador de Meteoros --------------

// Função para criar um novo meteoro em uma posição X aleatória
function gerarMeteoro() {
    // Posição X entre 0 e largura da tela
    const xAleatorio = Math.random() * (canvas.width - 30); 
    // Velocidade de queda entre 1 e 3
    const velocidadeYAleatoria = Math.random() * 2 + 1; 

    // Instanciamos um novo objeto Meteoro
    // (x: aleatório, y: -30, largura: 30, altura: 30, cor: 'red', velocidade: aleatória)
    const novoMeteoro = new Meteoro(xAleatorio, -30, 30, 30, 'red', velocidadeYAleatoria);
    
    // Adicionamos o novo objeto ao nosso array
    meteoros.push(novoMeteoro);
}

// O JavaScript chamará 'gerarMeteoro' a cada 1000 milissegundos (1 segundo)
setInterval(gerarMeteoro, 1000);




// -------------- Loop do Jogo --------------

function loopDoJogo() {
    // Limpar Tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualiza a tela e desenha os objetos nas devidas posições
    jogador.atualizar();

    // Atualiza e desenhar todos os meteoros do array
    for (let i = 0; i < meteoros.length; i++) {
        const meteoroAtual = meteoros[i];
        
        // O jogo atualiza, e o meteoro cai de acordo com a regra
        meteoroAtual.atualizar();

        // Remove meteoros que já saíram do fundo da tela da memória do array
        if (meteoroAtual.y > canvas.height) {
            meteoros.splice(i, 1);
            i--;
        }
    }

    // Repete o loop na próxima atualização de tela
    requestAnimationFrame(loopDoJogo);
}

// Dá play no jogo iniciando o loop pela primeira vez
loopDoJogo();

