from random import randint


extension = '.session.sql'

wrapperMin = 1
wrapperMax = 1000000

supplierMin = 1
supplierMax = 1000000


currentSupplier = supplierMin
currentWrapper = wrapperMin

wrappersPerSupplier = randint(3, 10)

for i in range(10):
    with open(f'supplied{i}{extension}', 'w') as f:
        f.write(f"INSERT INTO suppliedWrappers (supplierId, wrapperId) VALUES\n")
        for j in range(100000):
            f.write(f"({currentSupplier}, {currentWrapper}){';' if j == 99999 else ','}\n")
            currentWrapper += 1
            wrappersPerSupplier -= 1
            if wrappersPerSupplier == 0:
                currentSupplier += 1
                wrappersPerSupplier = randint(3, 10)
            if currentWrapper >= wrapperMax:
                exit(0)
            
            
            