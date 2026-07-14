let numbers = [12, 5, 8, 21, 3, 17, 9, 30, 2, 14];

for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]); 
}


for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > 10) { 
    console.log(numbers[i]);
    }
}


let sum = 0;
for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i] 
}
console.log("Sum:", sum);


let min = numbers[0]
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < min) {
        min = numbers[i]    
    }
}
console.log("Min:", min);



let evenCount = 0;
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
        evenCount++; 
    }
}
console.log("Even count:", evenCount);
