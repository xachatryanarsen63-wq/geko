const users = [
  { username: "admin", password: "1234", isBlocked: false },
  { username: "john", password: "qwerty", isBlocked: true },
  { username: "anna", password: "pass", isBlocked: false }
];
function login(users, username, password) {

  const user = users.find(u => u.username === username);


  if (!user) {
    console.log("Օգտատերը չի գտնվել");
    return;
  }


  if (user.password !== password) {
    console.log("Սխալ գաղտնաբառ");
    return;
  }

  
  if (user.isBlocked) {
    console.log("Օգտատերը արգելափակված է");
    return;
  }


  console.log(`Բարի գալուստ, ${username}`);
}

login(users,"john","qwerty")
