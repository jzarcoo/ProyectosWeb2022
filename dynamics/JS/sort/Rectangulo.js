export class Rectangulo {

    #x;
    #y;
    #width;
    #height;
    #color;
    #size;
    
    constructor (x, y, width, height, color, size) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#color = color;
        this.#size = size;
    }
    
    dibujar (ctx) {
	ctx.fillRect(this.x, this.y, this.width, this.height);
	ctx.fillStyle = this.color;
    }
    
}
