class Car {
  constructor(brand, model, color, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.color = color;
  }

  getInfo() {
    return `Սա ${this.brand} ${this.model} է, ${this.color} գույնի, արտադրված ${this.year} թվականին`;
  }

  getAge() {
    return 2026 - this.year;
  }
}

const bmw = new Car("bmw", "m3", "spitak", 2020);
const ford = new Car("ford", "fusion", "seri", 2015);

const cars = [bmw, ford];


cars.forEach(car => {
  console.log(car.getInfo());
});


cars.forEach(car => {
  console.log(`Տարիքը: ${car.getAge()}`);
});