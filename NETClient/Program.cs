using System;
using System.Net.Sockets;
using System.Text;

class Program
{
    static void Main()
    {
        Console.Write("Ingrese su número de cuenta: ");
        string cuenta = Console.ReadLine();

        Console.WriteLine("Seleccione una opción:");
        Console.WriteLine("1. Consultar saldo");
        Console.WriteLine("2. Retirar dinero");
        Console.WriteLine("3. Abonar dinero");
        string opcion = Console.ReadLine();

        string solicitud = $"{opcion},{cuenta}";

        if (opcion == "2" || opcion == "3")
        {
            Console.Write("Ingrese el monto: ");
            string monto = Console.ReadLine();
            solicitud += $",{monto}";
        }

        string respuesta = EnviarSolicitud(solicitud);
        Console.WriteLine("Respuesta del servidor: " + respuesta);
    }

    static string EnviarSolicitud(string mensaje)
    {
        using (TcpClient cliente = new TcpClient("127.0.0.1", 5000))
        {
            NetworkStream stream = cliente.GetStream();
            byte[] buffer = Encoding.UTF8.GetBytes(mensaje);
            stream.Write(buffer, 0, buffer.Length);

            buffer = new byte[1024];
            int bytesLeidos = stream.Read(buffer, 0, buffer.Length);
            return Encoding.UTF8.GetString(buffer, 0, bytesLeidos);
        }
    }
}