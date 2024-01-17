// MAIN
window.addEventListener("load", () => {
    /* FUNCIONES
    ---------------------------------------------------------------------------------------------------- */
    function drawGame() {
        tetris.cuadricula();
        tetris.dibujarMemoria();
        tetriminoUno.draw();
    }
    // function resizeCanvas() {
    //     canvas.width = 0.25 * window.innerWidth;
    //     canvas.height = 0.75 * window.innerHeight;
    //     drawGame();
    // }
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            // exitFullscreen is only available on the Document object.
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    function colision(tetrimino) {
        let resp = false
        for (let i = 0; i < tetrimino.mapa[tetrimino.forma].x.length; i++) {
            let columna = tetrimino.mapa[tetrimino.forma].x[i] / tetris.ancho;
            let fila = tetrimino.mapa[tetrimino.forma].y[i] / tetris.alto;
            if (tetris.campo[fila][columna]) {
                resp = true;
            }
        }
        return resp;
    }
    /* Clases
    ---------------------------------------------------------------------------------------------------- */
    class Tablero {
        constructor(columnas, filas) {
            this.filas = filas;
            this.columnas = columnas;
            this.ancho = canvas.width / this.columnas;
            this.alto = canvas.height / this.filas;
        }
        cuadricula() {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#dcdcdc";
            for (let i = this.ancho; i < canvas.width; i += this.ancho) {
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
            }
            for (let i = this.alto; i < canvas.height; i += this.alto) {
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
            }
            ctx.stroke();
            ctx.closePath();
        }
        dibujarMemoria() {
            for (let f = 0; f < this.filas; f++) {
                for (let c = 0; c < this.columnas; c++) {
                    if (this.campo[f][c]) {
                        ctx.fillStyle = this.campo[f][c];
                        ctx.fillRect(c * this.ancho, f * this.alto, this.ancho, this.alto);
                    }
                }
            }
        }
        almacenarTetrimino(tetrimino) {
            let estado = true;
            for (let i = 0; i < tetrimino.mapa[tetrimino.forma].x.length; i++) {
                if (tetrimino.mapa[tetrimino.forma].y[i] <= 0) {
                    // perdiste
                    console.log("game over");
                    estado = false;
		    location.reload();
                } else {
                    let columna = tetrimino.mapa[tetrimino.forma].x[i] / tetris.ancho;
                    let fila = tetrimino.mapa[tetrimino.forma].y[i] / tetris.alto;
                    this.campo[fila][columna] = tetrimino.color;
                }
            }
            if (estado) {
                this.random(); // Crear tetrimino random
            }
	    this.lineasABorrar();
        }
        random() {
            let max = 2, min = 0;
            let r = Math.floor((Math.random() * (max - min + 1)) + min)
            // console.log(r);
            switch (r) {
                case 0:
                    tetriminoUno = new ShapeO(canvas.width / 2, 0);
                    break;
                case 1:
                    tetriminoUno = new ShapeL(canvas.width / 2, 0);
                    break;
                case 2:
                    tetriminoUno = new ShapeS(canvas.width / 2, 0);
                    break;
                default:
                    break;
            }
            tetriminoUno.actualizaMapa();
        }
        matriz() {
            this.campo = new Array(this.filas);
            for (let fila = 0; fila < this.filas; fila++) {
                this.campo[fila] = new Array(this.columnas);
            }
        }

	lineasABorrar(){
	    let lineas = [];
	    for (let f= this.filas-1; f >=0; f--) {
		let agregar= true;
		for (let c = 0; c < this.columnas; c++) {
		    if(!this.campo[f][c]){
			agregar = false;
			break;
		    }
		}
		if(agregar) {
		    lineas.push(f);
		}
	    }
	    this.borrarLineasHorizontales(lineas);
	}
	
	borrarLineasHorizontales(lineas) {
	    for (const linea of lineas){
		for (let fila = linea; fila >= 0 ; fila--) {
		    for (let columna = 0; columna < this.columnas; columna++) {
			if (fila==0){
			    this.campo[fila][columna] = null;
			    continue;
			}
			this.campo[fila][columna]=this.campo[fila-1][columna];
		    }
		}
	    }
	}
    }
    class Tetrimino {
        constructor(posicionX, posicionY) {
            this.px = posicionX;
            this.py = posicionY;
        }
        draw() {
            ctx.fillStyle = this.color;
            for (let i = 0; i < this.mapa[this.forma].x.length; i++) {
                ctx.fillRect(this.mapa[this.forma].x[i], this.mapa[this.forma].y[i], tetris.ancho, tetris.alto);
            }
        }
        girar() {
            let siguienteForma = this.forma + 1;
            this.forma = (siguienteForma >= this.mapa.length) ? 0 : siguienteForma;
            // Colisiones de todos lados
            let minCoordenadaY = Math.min(...this.mapa[this.forma].y);
            let maxCoordenadaY = Math.max(...this.mapa[this.forma].y);
            let maxCoordenadaX = Math.max(...this.mapa[this.forma].x);
            let minCoordenadaX = Math.min(...this.mapa[this.forma].x);
            if (minCoordenadaY < 0 || (maxCoordenadaY + tetris.alto) > canvas.height || (maxCoordenadaX + tetris.ancho) > canvas.width || minCoordenadaX < 0) {
                let anteriorForma = this.forma - 1;
                this.forma = (anteriorForma < 0) ? this.mapa.length - 1 : anteriorForma;
            }
        }
        moveDown() {
            let maxCoordenadaY = Math.max(...this.mapa[this.forma].y);
            if ((maxCoordenadaY + tetris.alto) < canvas.height) { // Colisión ejeY abajo
                this.py += tetris.alto;
                console.log(this.py);
                this.actualizaMapa();
                if (colision(this)) {
                    this.py -= tetris.alto;
                    this.actualizaMapa();
                    tetris.almacenarTetrimino(this);
                }
            } else {
                tetris.almacenarTetrimino(this);
            }
        }
        moveRight() {
            let maxCoordenadaX = Math.max(...this.mapa[this.forma].x);
            if ((maxCoordenadaX + tetris.ancho) < canvas.width) { // Colisión ejeX derecha
                this.px += tetris.ancho;
                this.actualizaMapa();
                if (colision(this)) {
                    this.px -= tetris.ancho;
                    this.actualizaMapa();
                    tetris.almacenarTetrimino(this);
                }
            }
        }
        moveLeft() {
            let minCoordenadaX = Math.min(...this.mapa[this.forma].x);
            if (minCoordenadaX > 0) { // Colisión ejeX izquierda
                this.px -= tetris.ancho;
                this.actualizaMapa();
                if (colision(this)) {
                    this.px += tetris.ancho;
                    this.actualizaMapa();
                    tetris.almacenarTetrimino(this);
                }
            }
        }
    }
    class ShapeL extends Tetrimino {
        constructor(posicionX, posicionY, color, mapa, forma) {
            super(posicionX, posicionY, color, mapa, forma);
            this.color = "blue";
            this.forma = 0;
        }
        actualizaMapa() {
            this.mapa = [
                {
                    x: [this.px, this.px, this.px, this.px],
                    y: [this.py, (this.py + tetris.alto), (this.py + tetris.alto * 2), (this.py + tetris.alto * 3)],
                },
                {
                    x: [this.px, (this.px + tetris.ancho), (this.px + tetris.ancho * 2), (this.px + tetris.ancho * 3)],
                    y: [this.py, this.py, this.py, this.py],
                },
            ];
        }
    }
    class ShapeS extends Tetrimino {
        constructor(posicionX, posicionY, color, mapa, forma) {
            super(posicionX, posicionY, color, mapa, forma);
            this.color = "red";
            this.forma = 0;
        }
        actualizaMapa() {
            this.mapa = [
                {
                    x: [this.px, (this.px + tetris.ancho), this.px, (this.px - tetris.ancho)],
                    y: [this.py, this.py, (this.py + tetris.alto), (this.py + tetris.alto)],
                },
                {
                    x: [this.px, this.px, (this.px - tetris.ancho), (this.px - tetris.ancho)],
                    y: [this.py, (this.py + tetris.alto), this.py, (this.py - tetris.alto)],
                },
            ];
        }
    }
    class ShapeO extends Tetrimino {
        constructor(posicionX, posicionY, color, mapa, forma) {
            super(posicionX, posicionY, color, mapa, forma);
            this.color = "yellow";
            this.forma = 0;
        }
        actualizaMapa() {
            this.mapa = [
                {
                    x: [this.px, (this.px + tetris.ancho), this.px, (this.px + tetris.ancho)],
                    y: [this.py, (this.py + tetris.alto), (this.py + tetris.alto), this.py],
                },
            ];
        }
    }
    /* VARIABLES
    ---------------------------------------------------------------------------------------------------- */
    const canvas = document.querySelector("#tetris");
    const ctx = canvas.getContext("2d");
    var playing = false;
    const tetris = new Tablero(10, 20);
    tetris.matriz();
    var tetriminoUno;
    tetris.random();
    tetriminoUno.actualizaMapa();
    
    /* EVENTOS
    ---------------------------------------------------------------------------------------------------- */
    drawGame();
    setInterval(() => {
        tetriminoUno.moveDown();
        drawGame();
    }, 300);
    // resizeCanvas();
    // window.addEventListener('resize', resizeCanvas, false);
    document.addEventListener("keydown", function (e) {
        switch (e.key) {
            case "Enter":
                // Fullscreen API
                toggleFullScreen();
                // if (!playing) {
                //     playing = true;
                //     tetris.cuadricula();
                // } else {
                //     playing = false;
                //     ctx.beginPath();
                //     ctx.clearRect(0,0,canvas.width,canvas.height);
                //     ctx.closePath();
                // }
                break;
            case "ArrowUp":
            tetriminoUno.girar();
                drawGame();
                break;
            case "ArrowDown":
                tetriminoUno.moveDown();
                drawGame();
                break;
            case "ArrowRight":
                tetriminoUno.moveRight();
                drawGame();
                break;
            case "ArrowLeft":
                tetriminoUno.moveLeft();
                drawGame();
                break;
            default:
                break;
        }
    }, false);
});
