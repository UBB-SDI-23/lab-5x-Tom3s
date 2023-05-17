from random import randint


extension = '.session.sql'

wrapperMin = 1
wrapperMax = 1000000

boxMin = 1
boxMax = 1000000


currentbox = boxMin
currentWrapper = wrapperMin

for i in range(100):
    with open(f'combo{i}{extension}', 'w') as f:
        f.write(f"INSERT INTO combos (boxId, wrapperId, name, price) VALUES\n")
        for j in range(10000):
            wrappers = set()
            while wrappers.__len__() != 10:
                wrappers.add(randint(wrapperMin, wrapperMax))
            
            box = randint(boxMin, boxMax)
            index = 0
            for wrapper in wrappers:
                name = f'B{box}-W{wrapper}-X{randint(i,j+i+1)}'
                price = float(randint(1, 99)) + 0.99
                f.write(f"({box}, {wrapper}, '{name}', {price}){';' if j == 9999 and index == 9 else ','}\n")
                index += 1