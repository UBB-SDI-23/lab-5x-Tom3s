from random import choice, randint

extension = '.session.sql'

import random

users = {
    "minim": 1,
    "maxim": 10000
}

boxes = {
    "minim": 1,
    "maxim": 1000000
}

wrappers = {
    "minim": 1,
    "maxim": 1000000
}

suppliers = {
    "minim": 1,
    "maxim": 1000000
}

combos = {
    "minim": 4,
    "maxim": 10_000_000
}

boxId = boxes["minim"]

for i in range(10):
    with open(f'box_owners{i}{extension}', 'w') as f:
        f.write("INSERT INTO box_owners (boxid, userid) VALUES\n")
        for j in range(100000):
            f.write(f"({boxId}, {random.randint(users['minim'], users['maxim'])}){';' if j == 99999 else ','}\n")
            boxId += 1


wrapperId = wrappers["minim"]

for i in range(10):
    with open(f'wrapper_owners{i}{extension}', 'w') as f:
        f.write("INSERT INTO wrapper_owners (wrapperid, userid) VALUES\n")
        for j in range(100000):
            f.write(f"({wrapperId}, {random.randint(users['minim'], users['maxim'])}){';' if j == 99999 else ','}\n")
            wrapperId += 1
                
supplierId = suppliers["minim"]

for i in range(10):
    with open(f'supplier_owners{i}{extension}', 'w') as f:
        f.write("INSERT INTO supplier_owners (supplierid, userid) VALUES\n")
        for j in range(100000):
            f.write(f"({supplierId}, {random.randint(users['minim'], users['maxim'])}){';' if j == 99999 else ','}\n")
            supplierId += 1

comboId = combos["minim"]

for i in range(100):
    with open(f'combo_owners{i}{extension}', 'w') as f:
        f.write("INSERT INTO combo_owners (comboid, userid) VALUES\n")
        for j in range(100000):
            f.write(f"({comboId}, {random.randint(users['minim'], users['maxim'])}){';' if j == 99999 else ','}\n")
            comboId += 1

