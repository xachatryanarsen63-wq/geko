# while True:
#     try:
#         x = int(input("Gri tiv: "))
#         break
#     except ValueError: 
#         print("gri tiv voch te tar")

# if x < 0:
#     print("chkpav")
# elif x > 0:
#     print("exav")
# else:
#     print("zro")



# choice = input("C -> F or F -> C? ").upper()

# if choice == "C":
#     c = float(input("Enter temp in °C: "))
#     f = (c * 9 / 5) + 32
#     print("temp in °F:", f)

# elif choice == "F":
#     f = float(input("Enter temp in °F: "))
#     c = (f - 32) * 5 / 9
#     print("temp in °C:", c)

# else:
#     print("error")

# 

# board = [" " for _ in range(9)]

# def print_board():
#     print()
#     for i in range(0, 9, 3):
#         print(f" {board[i]} | {board[i+1]} | {board[i+2]} ")
#         if i < 6:
#             print("---+---+---")
#     print()

# def check_winner(player):
#     wins = [
#         [0,1,2], [3,4,5], [6,7,8],  # rows
#         [0,3,6], [1,4,7], [2,5,8],  # columns
#         [0,4,8], [2,4,6]            # diagonals
#     ]
    
#     for combo in wins:
#         if all(board[i] == player for i in combo):
#             return True
#     return False

# def board_full():
#     return " " not in board

# current_player = "X"

# while True:
#     print_board()

#     try:
#         move = int(input(f"Player {current_player}, choose position (1-9): ")) - 1

#         if move < 0 or move > 8:
#             print("Invalid position!")
#             continue

#         if board[move] != " ":
#             print("Position already taken!")
#             continue

#         board[move] = current_player

#         if check_winner(current_player):
#             print_board()
#             print(f"Player {current_player} wins!")
#             break

#         if board_full():
#             print_board()
#             print("It's a draw!")
#             break

#         current_player = "O" if current_player == "X" else "X"

#     except ValueError:
#         print("Please enter a number from 1 to 9.")


# class Car:
#     def __init__(self,mark,model,year):
#         self.mark = mark
#         self.model = model
#         self.year = year

#     def tech(self):
#         print(f"{self.mark} {self.model} artadrvac {self.year}in")



# mercedes = Car("Mersedes","c63","2019")
# bmw = Car("BMW","G80","2025")
# toyota = Car("Toyota","Camry","2022")

# mercedes.tech()
# bmw.tech()
# toyota.tech()

n = int(input("Գրիր անկյունների քանակը: "))

angle = (n - 2) * 180 / n

print("Մեկ անկյան աստիճանը =", angle)