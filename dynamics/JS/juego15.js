/* FUNCTIONS
---------------------------------------------------------------------------*/
function getNumberArray(n){
    let numbers=[];
    let exponentiation=Math.pow(n,2);
    for(let i=1;i<exponentiation;i++){
        numbers[i-1]=i;
    }
    numbers.push(0);
    return numbers;
}
function createMatriz(n){
    for(let i=0;i<n;i++){
        board[i]=new Array(n);
    }
}
function createGrid(n){
    document.querySelector("html").style.setProperty("--ncolumns",n);
    // Memory leak
    let boardHTML=document.querySelector("#juego15");
    while(boardHTML.firstChild){
        boardHTML.firstChild.removeEventListener("click",move);
        boardHTML.firstChild.removeEventListener("keydown",keyPressed);
        boardHTML.removeChild(boardHTML.firstChild);
    }
}
function random(min,max){
    return Math.floor((Math.random()*(max-min))+min);
}
function hasZero(c,r){
    let answer;
    if((r+1)<board.length&&board[c][r+1]==0){
        answer="right";
    }else if((r-1)>=0&&board[c][r-1]==0){
        answer="left";
    }else if((c-1)>=0&&board[c-1][r]==0){
        answer="up";
    }else if((c+1)<board.length&&board[c+1][r]==0){
        answer="down";
    }else{
        answer=false;
    }
    return answer;
}
function displacementHTML(number,div){
    let itemZero=div.parentNode.children.num_0;
    itemZero.setAttribute("id","num_"+number);
    itemZero.dataset.number=number;
    itemZero.innerHTML=number;
    div.setAttribute("id","num_"+0);
    div.dataset.number=0;
    div.innerHTML="";
}
function displacementMatriz(c,r,number,direction){
    board[c][r]=0;
    if(direction=="right"){
        board[c][r+1]=number;
    }else if(direction=="left"){
        board[c][r-1]=number;
    }else if(direction=="up"){
        board[c-1][r]=number;
    }else if(direction=="down"){
        board[c+1][r]=number;
    }
}
function winning(movements){
    console.log("Ganaste",movements);
}
function move(event){
    let item=event.currentTarget;
    let column=parseInt(item.dataset.column), row=parseInt(item.dataset.row), number=parseInt(item.dataset.number);
    let isMoving=hasZero(column,row);
    if(isMoving!=false){
        movements++;
        displacementHTML(number,item);
        document.getElementById("num_"+number).focus();
        displacementMatriz(column,row,number,isMoving);
        // console.log("moviendose",isMoving,movements,board);
        if(board.join()==winningArray.join()){
            winning(movements);
        }
    }
}
function keyPressed(event){
    let div=event.currentTarget, k=event.key;
    let c=parseInt(div.dataset.column), r=parseInt(div.dataset.row), number=parseInt(div.dataset.number);
    if(k==" " || k=="Enter"){
        if(div.dataset.number!=0)
            move(event);  
    } else if(k=="ArrowUp" || k=="ArrowDown" || k=="ArrowLeft" || k=="ArrowRight" || k=="w" || k=="s" || k=="a" || k=="d" || k=="W" || k=="S" || k=="A" || k=="D"){
        if(k=="ArrowUp" || k=="w" || k=="W"){
            if((c-1)>=0){
                number=parseInt(board[c-1][r]);
            } else {
                number=parseInt(board[board.length-1][r]);
            }
        } else if(event.key=="ArrowDown" || k=="s" || k=="S"){
            if((c+1)<board.length){
                number=parseInt(board[c+1][r]);
            } else {
                number=parseInt(board[0][r]);
            }
        } else if(event.key=="ArrowLeft" || k=="a" || k=="A"){
            if((r-1)>=0){
                number=parseInt(board[c][r-1]);
            } else {
                number=parseInt(board[c][board.length-1]);
            }
        } else if(event.key=="ArrowRight" || k=="d" || k=="D"){
            if((r+1)<board.length){
                number=parseInt(board[c][r+1]);
            } else {
                number=parseInt(board[c][0]);
            }
        }
        document.getElementById("num_"+number).focus();
    }
}
function createItem(text1,column,row){
    let container=document.getElementById("juego15");
    let item=document.createElement("div");
    item.setAttribute("tabindex","0");
    item.setAttribute("class","item");
    item.setAttribute("id","num_"+text1);
    item.dataset.number=text1;
    item.dataset.column=column;
    item.dataset.row=row;
    item.innerHTML=(text1==0)?"":text1;
    item.addEventListener("click",move);
    item.addEventListener("keydown",keyPressed);
    container.appendChild(item);
}
function getRandomMatriz(){
    let numbers=winningArray.slice();
    for(let i=0;i<board.length;i++){
        for(let j=0;j<board.length;j++){
            let number=numbers[random(0,numbers.length)];
            let index=numbers.indexOf(number);
            numbers.splice(index,1);
            board[i][j]=number;
            createItem(number,i,j);
        }
    }
}
/* VARIABLES
---------------------------------------------------------------------------*/
var dimension=4;
var board=[], winningArray=getNumberArray(dimension), movements=0;
createMatriz(dimension);
createGrid(dimension);
getRandomMatriz();