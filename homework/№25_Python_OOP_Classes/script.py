class BankAccount:
    def __init__(self, owner):
        self.owner = owner
        self.balance = 0

    def deposit(self, amount):
        if amount <= 0:
            print("Սխալ գումար։")
        else:
            self.balance += amount
            print("Գումարը հաջողությամբ մուտքագրվեց։")

    def withdraw(self, amount):
        if amount <= 0:
            print("Սխալ գումար։")
        elif amount > self.balance:
            print("Բավարար գումար չկա։")
        else:
            self.balance -= amount
            print("Գումարը հաջողությամբ հանվեց։")

    def transfer(self, other, amount):
        if amount <= 0:
            print("Սխալ գումար։")
        elif amount > self.balance:
            print("Բավարար գումար չկա։")
        else:
            self.balance -= amount
            other.balance += amount
            print("Փոխանցումը կատարվեց հաջողությամբ։")

    def show_info(self):
        print(f"Անուն: {self.owner}")
        print(f"Մնացորդ: {self.balance}")


accounts = {}

while True:
    print("\n===== MENU =====")
    print("1 - Ստեղծել հաշիվ")
    print("2 - Մուտքագրել գումար")
    print("3 - Հանել գումար")
    print("4 - Փոխանցել գումար")
    print("5 - Ցույց տալ մեկ հաշիվ")
    print("6 - Ցույց տալ բոլոր հաշիվները")
    print("7 - Ջնջել հաշիվ")
    print("8 - Ամենահարուստ հաճախորդ")
    print("9 - Վիճակագրություն")
    print("0 - Ելք")

    choice = input("Ընտրություն: ")

    if choice == "1":
        owner = input("Մուտքագրեք անունը: ")

        if owner in accounts:
            print("Այս անունով հաշիվ արդեն գոյություն ունի։")
        else:
            accounts[owner] = BankAccount(owner)
            print("Հաշիվը ստեղծվեց։")

    elif choice == "2":
        owner = input("Անուն: ")

        if owner in accounts:
            amount = float(input("Գումար: "))
            accounts[owner].deposit(amount)
        else:
            print("Հաշիվը չի գտնվել։")

    elif choice == "3":
        owner = input("Անուն: ")

        if owner in accounts:
            amount = float(input("Գումար: "))
            accounts[owner].withdraw(amount)
        else:
            print("Հաշիվը չի գտնվել։")

    elif choice == "4":
        sender = input("Որտեղի՞ց: ")
        receiver = input("Ո՞ւմ: ")

        if sender not in accounts:
            print("Ուղարկողի հաշիվը չի գտնվել։")
        elif receiver not in accounts:
            print("Ստացողի հաշիվը չի գտնվել։")
        else:
            amount = float(input("Գումար: "))
            accounts[sender].transfer(accounts[receiver], amount)

    elif choice == "5":
        owner = input("Անուն: ")

        if owner in accounts:
            accounts[owner].show_info()
        else:
            print("Հաշիվը չի գտնվել։")

    elif choice == "6":
        if len(accounts) == 0:
            print("Հաշիվներ չկան։")
        else:
            for account in accounts.values():
                account.show_info()
                print("-" * 20)

    elif choice == "7":
        owner = input("Անուն: ")

        if owner in accounts:
            del accounts[owner]
            print("Հաշիվը ջնջվեց։")
        else:
            print("Հաշիվը չի գտնվել։")

    elif choice == "8":
        if len(accounts) == 0:
            print("Հաշիվներ չկան։")
        else:
            richest = max(accounts.values(), key=lambda x: x.balance)
            print("Ամենահարուստ հաճախորդը՝")
            richest.show_info()

    elif choice == "9":
        count = len(accounts)

        if count == 0:
            print("Հաշիվներ չկան։")
        else:
            total = sum(acc.balance for acc in accounts.values())
            average = total / count
            zero_accounts = sum(1 for acc in accounts.values() if acc.balance == 0)

            print(f"Հաշիվների քանակը: {count}")
            print(f"Ընդհանուր գումարը: {total}")
            print(f"Միջին մնացորդը: {average:.2f}")
            print(f"Զրոյական մնացորդ ունեցող հաշիվներ: {zero_accounts}")

    elif choice == "0":
        print("Ծրագիրն ավարտվեց։")
        break

    else:
        print("Սխալ ընտրություն։")