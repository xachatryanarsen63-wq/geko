const orders = [
  {
    id: 1,
    user: "Ivan",
    items: [
      { name: "Laptop", price: 1200, qty: 1 },
      { name: "Mouse", price: 25, qty: 2 }
    ],
    status: "pending",
    createdAt: "2026-04-28"
  },
  {
    id: 2,
    user: "Anna",
    items: [
      { name: "Phone", price: 800, qty: 1 }
    ],
    status: "completed",
    createdAt: "2026-04-20"
  },
  {
    id: 3,
    user: "Ivan",
    items: [
      { name: "Keyboard", price: 100, qty: 1 }
    ],
    status: "pending",
    createdAt: "2026-04-29"
  }
];


const calculateOrderTotal = order =>
  order.items.reduce((sum, { price, qty }) => sum + price * qty, 0);


const getUserPendingOrders = (orders, username) =>
  orders.filter(o => o.user === username && o.status === "pending");


const getTotalRevenue = orders =>
  orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + calculateOrderTotal(o), 0);

const groupOrdersByUser = orders =>
  orders.reduce((acc, o) => {
    acc[o.user] = acc[o.user] || [];
    acc[o.user].push(o);
    return acc;
  }, {});


const getTopUsers = (orders, topN) =>
  Object.entries(
    orders
      .filter(o => o.status === "completed")
      .reduce((acc, o) => {
        acc[o.user] = (acc[o.user] || 0) + calculateOrderTotal(o);
        return acc;
      }, {})
  )
    .map(([user, total]) => ({ user, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, topN);


// ===== TEST =====
console.log("Order total:", calculateOrderTotal(orders[0]));
console.log("Ivan pending:", getUserPendingOrders(orders, "Ivan"));
console.log("Revenue:", getTotalRevenue(orders));
console.log("Grouped:", groupOrdersByUser(orders));
console.log("Top users:", getTopUsers(orders, 2));