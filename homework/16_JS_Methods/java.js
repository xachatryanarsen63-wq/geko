const transactions = [
    { id: "T001", info: "  apple.com/bill  ", amount: "1200.50 USD", date: "2023-10-01" },
    { id: "T002", info: "Sberbank Transfer", amount: "5000.00 RUB", date: "2023-10-01" },
    { id: "T003", info: "APPLE.COM/BILL", amount: "1200.50 USD", date: "2023-10-01" },
    { id: "T004", info: " Netflix Subscription ", amount: "15.99 USD", date: "2023-10-02" },
    { id: "T005", info: "Amazon Web Services", amount: "450.00 USD", date: "2023-10-03" },
    { id: "T006", info: "Apple.com/bill", amount: "30.00 USD", date: "2023-10-04" }
];


const normalized = transactions.map(t => {
    const [value, currency] = t.amount.split(" ");

    return {
        ...t,
        info: t.info.trim().toLowerCase(),
        amount: {
            value: parseFloat(value),
            currency: currency
        }
    };
});


const unique = normalized.filter((item, index, arr) =>
    index === arr.findIndex(el =>
        el.info === item.info &&
        el.amount.value === item.amount.value &&
        el.amount.currency === item.amount.currency &&
        el.date === item.date
    )
);


const converted = unique.map(t => {
    if (t.amount.currency === "RUB") {
        return {
            ...t,
            amount: {
                value: +(t.amount.value / 90).toFixed(2),
                currency: "USD"
            }
        };
    }
    return t;
});


const grouped = converted.reduce((acc, t) => {
    if (!acc[t.info]) {
        acc[t.info] = [];
    }
    acc[t.info].push(t);
    return acc;
}, {});


const total = converted.reduce((sum, t) => sum + t.amount.value, 0);

console.log("Grouped:", grouped);
console.log("Total USD:", total.toFixed(2));