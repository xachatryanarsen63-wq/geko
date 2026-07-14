const rows = 6;
const cols = 8;
const price = 10;

const grid = document.getElementById("grid");
const countEl = document.getElementById("count");
const totalEl = document.getElementById("total");
const bookBtn = document.getElementById("book");

let seats = [];


for (let i = 0; i < rows * cols; i++) {
  const seat = document.createElement("div");
  seat.classList.add("seat", "free");

  
  if (Math.random() < 0.2) {
    seat.classList.remove("free");
    seat.classList.add("busy");
  }

  seat.addEventListener("click", () => {
    if (seat.classList.contains("busy")) return;

    seat.classList.toggle("selected");
    update();
  });

  grid.appendChild(seat);
  seats.push(seat);
}


function update() {
  const selected = seats.filter(s => s.classList.contains("selected"));

  countEl.textContent = selected.length;
  totalEl.textContent = selected.length * price;
}


bookBtn.addEventListener("click", () => {
  const selected = seats.filter(s => s.classList.contains("selected"));

  selected.forEach(seat => {
    seat.classList.remove("selected");
    seat.classList.add("busy");
  });

  update();
});