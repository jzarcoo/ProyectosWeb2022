import { Rectangulo } from "./Rectangulo.js";

function swap (arr, i, j){
    if (i == j)
	return;
    let aux = arr[i];
    arr[i] = arr[j];
    arr[j] = aux;
}

async function selectionSort(arr){
    for (i = 0; i < arr.length - 1; i++) {
	m = i;
	for (j = i + 1; j < arr.length; j++) {
	    if (arr[j] < arr[m])
		m = j;
	    await new Promise (resolve => setTimeout(resolve, 20));
	}
	swap(arr, m, i);
	// Espera 1000 = 1 segundo
	// await new Promise (resolve => setTimeout(resolve, 1000));
    }
}

function drawArr () {
    numbers.forEach((n, index) => {
	let alto = canvas.height * n / 100;
	
	let x = index * anchoRectangulo;
	let y = canvas.height - alto;
	
	ctx.fillStyle = "orange";
	if(index == m || index == i) ctx.fillStyle = "lightblue";
	ctx.fillRect(x, y, anchoBarra, canvas.height);
	
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.font = '20px serif';
	ctx.fillText(`${n}`, x + (anchoBarra / 2), canvas.height - 20);
    });
}

function drawTriangle () {
    let colores = ["green", "blue", "red"];
    let indices = [i , j , m];
    // let indices = [pivot, pivotIndex];
    let contador = 0;
    indices.forEach(n => {
	ctx.fillStyle = colores[contador];
	contador++;
	
	ctx.beginPath();
	
	ctx.moveTo((n * anchoRectangulo) + (anchoBarra / 2), canvas.height - 20);  // Punto superior
	ctx.lineTo(n * anchoRectangulo, canvas.height);  // Punto inferior izquierdo
	ctx.lineTo((n * anchoRectangulo) + anchoBarra, canvas.height); // Punto inferior derecho
    
	ctx.closePath();
	ctx.fill();
    });
}

function draw () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawArr();

    drawTriangle();
    
    window.requestAnimationFrame(draw);
}

const canvas = document.getElementById("sort");
const ctx = canvas.getContext("2d");
const anchoRectangulo = canvas.width / 50;
const anchoBarra = anchoRectangulo / 2;
let i, j, m, pivot, pivotIndex;

const btn = document.getElementById("btn");

const numbers = Array.from( {length : 50}, () => Math.floor(Math.random() * (100 - 1 + 1) + 1) );

btn.addEventListener("click", () => selectionSort(numbers));

window.requestAnimationFrame(draw);
