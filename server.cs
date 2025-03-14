
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;

class Program
{
    private static string rutaArchivo = "datos.txt";
    private static ConcurrentDictionary<string, decimal> cuentas = new ConcurrentDictionary<string, decimal>();

    static void Main()
    {
        CargarDatos();
        TcpListener servidor = new TcpListener(IPAddress.Any, 5000);
        servidor.Start();
        Console.WriteLine("Servidor iniciado en el puerto 5000...");

        while (true)
        {
            TcpClient cliente = servidor.AcceptTcpClient();
            Task.Run(() => ManejarCliente(cliente));
        }
    }

    static void ManejarCliente(TcpClient cliente)
    {
        NetworkStream stream = cliente.GetStream();
        byte[] buffer = new byte[1024];

        while (true) // Bucle para mantener la conexión activa
        {
            int bytesLeidos = stream.Read(buffer, 0, buffer.Length);
            if (bytesLeidos == 0) break; // Salir si el cliente cierra la conexión

            string solicitud = Encoding.UTF8.GetString(buffer, 0, bytesLeidos).Trim();
            
            if (solicitud.ToLower() == "salir") 
            {
                byte[] mensajeSalida = Encoding.UTF8.GetBytes("Conexión cerrada. Gracias por usar el servicio.");
                stream.Write(mensajeSalida, 0, mensajeSalida.Length);
                break; // Salir del bucle y cerrar la conexión
            }
            string respuesta = ProcesarSolicitud(solicitud);
            byte[] respuestaBytes = Encoding.UTF8.GetBytes(respuesta + "\n");
            stream.Write(respuestaBytes, 0, respuestaBytes.Length);
        }
        cliente.Close(); // Cerrar conexión cuando el cliente finaliza
    }
    static string ProcesarSolicitud(string solicitud)
    {
        string[] partes = solicitud.Split(',');
        if (partes.Length < 2) return "Formato incorrecto";

        string opcion = partes[0];
        string cuenta = partes[1];
        if (!cuentas.ContainsKey(cuenta)) return "Cuenta no encontrada";

        switch (opcion)
        {
            case "1": // Consultar saldo
                return $"Saldo: {cuentas[cuenta]:C}";

            case "2": // Retiro
                if (partes.Length < 3) return "Monto no especificado";
                decimal montoRetiro = Convert.ToDecimal(partes[2]);
                if (cuentas[cuenta] >= montoRetiro)
                {
                    cuentas[cuenta] -= montoRetiro;
                    GuardarDatos();
                    return $"Retiro exitoso. Nuevo saldo: {cuentas[cuenta]:C}";
                }
                return "Fondos insuficientes";
            case "3": // Abono
                if (partes.Length < 3) return "Monto no especificado";
                decimal montoAbono = Convert.ToDecimal(partes[2]);
                cuentas[cuenta] += montoAbono;
                GuardarDatos();
                return $"Abono exitoso. Nuevo saldo: {cuentas[cuenta]:C}";

            default:
                return "Opción no válida";
        }
    }
    static void CargarDatos()
    {
        if (!File.Exists(rutaArchivo)) return;

        foreach (var linea in File.ReadAllLines(rutaArchivo))
        {
            var partes = linea.Split(',');
            if (partes.Length == 2)
            {
                cuentas[partes[0]] = Convert.ToDecimal(partes[1]);
            }
        }
    }
    static void GuardarDatos()
    {
        using (StreamWriter writer = new StreamWriter(rutaArchivo))
        {
            foreach (var cuenta in cuentas)
            {
                writer.WriteLine($"{cuenta.Key},{cuenta.Value}");
            }
        }
    }
}

