const ROWS = 17;

const triangle = document.getElementById("triangle");

let pascal = [];

for(let i=0;i<ROWS;i++){

    pascal[i]=[];

    for(let j=0;j<=i;j++){

        if(j===0 || j===i){
            pascal[i][j]=1;
        }else{
            pascal[i][j]=pascal[i-1][j-1]+pascal[i-1][j];
        }

    }

}

pascal.forEach(row=>{

    const rowDiv=document.createElement("div");
    rowDiv.className="row";

    row.forEach(value=>{

        const hex=document.createElement("div");
        hex.className="hex";
        hex.textContent=value;

        rowDiv.appendChild(hex);

    });

    triangle.appendChild(rowDiv);

});