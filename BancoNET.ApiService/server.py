import socket
import threading

class Cuenta:
    def __init__(self, id:int, nombre:str, apellido1:str, apellido2:str, nacimiento:int, saldo:int, contrasena:str):
        self.id = id
        self.nombre = nombre
        self.apellido1 = apellido1
        self.apellido2 = apellido2
        self.nacimiento = nacimiento
        self.saldo = saldo
        self.contrasena = contrasena

    def passwordCorrecta(self, contrasena):
        return self.contrasena == contrasena

    def consultarSaldo(self):
        return self.saldo

    def sacarDinero(self, cantidad):
        if cantidad <= self.saldo:
            self.saldo -= cantidad
            return True
        return False

    def ingresarDinero(self, cantidad):
        self.saldo += cantidad

    def __str__(self):
        return f"{self.nombre} {self.apellido1} {self.apellido2}"


class Banco:
    def __init__(self):
        self.cuentas = []

    def agregarCuenta(self, cuenta: Cuenta):
        self.cuentas.append(cuenta)

    def buscarCuenta(self, id:int):
        for cuenta in self.cuentas:
            if cuenta.id == id:
                return cuenta
        return None

    def listarCuentas(self):
        return [str(cuenta) for cuenta in self.cuentas]

def deArchivoAObjeto():
    with open("datos.txt", "r") as archivo:
        lineas = archivo.readlines()
        cuentas = []
        for linea in lineas:
            cuenta = linea.split(" ")
            cuenta = Cuenta(int(cuenta[0]), cuenta[1], cuenta[2], cuenta[3], int(cuenta[4]), int(cuenta[5]), cuenta[6])
            cuentas.append(cuenta)
        return cuentas
    
def deObjetoAArchivo(cuentas):
    with open("datos.txt", "w") as archivo:
        for cuenta in cuentas:
            archivo.write(f"{cuenta.id} {cuenta.nombre} {cuenta.apellido1} {cuenta.apellido2} {cuenta.nacimiento} {cuenta.saldo} {cuenta.contrasena}")
    
def floatToInt(cantidad):
    cantidadentera = cantidad.split(".")[0]
    if len(cantidad.split(".")) == 1:
        cantidaddecimal = "00"
    else:
        cantidaddecimal = cantidad.split(".")[1]
    cantidad = int(cantidadentera)*100 + int(cantidaddecimal)
    return cantidad

def handle_input_client(client_socket, MAX_INPUT=1024):
    fullinput = []
    i = 0
    while i < MAX_INPUT:
        
        lastinput = client_socket.recv(1).decode('utf-8')
        if lastinput == "\n":
            break
        i += 1
        fullinput.append(lastinput)
        
    print(f"Received: |{fullinput}|")
    fullinput.pop()
    print(f"Received poped: |{''.join(fullinput)}|")
    return ''.join(fullinput)

class TelnetServer:
    def __init__(self, host='127.0.0.1', port=4000):
        self.banco = Banco()
        
        cuentas = deArchivoAObjeto()
        for cuenta in cuentas:
            self.banco.agregarCuenta(cuenta)
        

        self.host = host
        self.port = port
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(5)
        print(f"Telnet en {self.host}:{self.port}")

    

    def handle_client(self, client_socket):
        # copiamos el codigo de banco.py
        client_socket.send(b"TE HAS CONECTADO AL BANCO!\n")
        while True:
            client_socket.send(b"1. Saldo\n2. Retirar\n3. Depositar\n4. Salir\n")
            client_socket.send(b"Opcion: ")
            command = handle_input_client(client_socket)
            if command == '1':  # Saldo
                client_socket.send(b"Ingrese su ID: ")
                id = int(handle_input_client(client_socket))
                #client_socket.send(b"Ingrese su Contrasena: ")
                #contrasena = handle_input_client(client_socket)
                cuenta = self.banco.buscarCuenta(id)
                if cuenta is not None:
                    saldo = cuenta.consultarSaldo() / 100
                    client_socket.send(f"Hola {cuenta}\nSaldo: ${saldo:.2f}\nPulse Enter para Continuar\n".encode('utf-8'))
                else:
                    client_socket.send(b"Cuenta no encontrada\n")
                handle_input_client(client_socket)
            elif command == '2':  # Retiro
                client_socket.send(b"Ingrese su ID: ")
                id = int(handle_input_client(client_socket))
                #client_socket.send(b"Ingrese su Contrasena: ")
                #contrasena = handle_input_client(client_socket)
                cuenta = self.banco.buscarCuenta(id)
                if cuenta is not None:
                    saldoAnterior = cuenta.consultarSaldo()
                    client_socket.send(b"Ingrese la cantidad a Retirar: ")
                    cantidad = handle_input_client(client_socket)
                    cantidad = floatToInt(cantidad)
                    cuenta.sacarDinero(cantidad)
                    saldoActual = cuenta.consultarSaldo() / 100
                    client_socket.send(f"Hola {cuenta}\nRetiro exitoso\nSaldo anterior: ${saldoAnterior / 100:.2f}\nSaldo actual: ${saldoActual:.2f}\n".encode('utf-8'))
                else:
                    client_socket.send(b"Cuenta no encontrada\n")

            elif command == '3':  # Depositar
                client_socket.send(b"Ingrese su ID: ")
                id = int(handle_input_client(client_socket))
                #client_socket.send(b"Ingrese su Contrasena: ")
                #contrasena = handle_input_client(client_socket)
                cuenta = self.banco.buscarCuenta(id)
                if cuenta is not None:
                    saldoAnterior = cuenta.consultarSaldo()
                    client_socket.send(b"Ingrese la cantidad a Depositar: ")
                    cantidad = handle_input_client(client_socket)
                    cantidad = floatToInt(cantidad)
                    cuenta.ingresarDinero(cantidad)
                    saldoActual = cuenta.consultarSaldo() / 100
                    client_socket.send(f"Hola {cuenta}\nIngreso exitoso\nSaldo anterior: ${saldoAnterior / 100:.2f}\nSaldo actual: ${saldoActual:.2f}\n".encode('utf-8'))
                else:
                    client_socket.send(b"Cuenta no encontrada\n")
            elif command == '4':
                client_socket.send(b"Adios!\n")
                break
            else:
                client_socket.send(b"Opcion no valida\n")

            deObjetoAArchivo(self.banco.cuentas)
        client_socket.close()

    def run(self):
        while True:
            client_socket, addr = self.server_socket.accept()
            print(f"Conexion desde {addr}")
            client_handler = threading.Thread(target=self.handle_client, args=(client_socket,))
            client_handler.start()

if __name__ == "__main__":
    server = TelnetServer()
    server.run()