using BancoNET.ApiService;
using System;
using System.Collections.Generic;


namespace BancoNET.ApiService {
    internal class Banco
    {
        private List<Cuenta> cuentas;

        public Banco()
        {
            cuentas = [];
        }

        public void AgregarCuenta(Cuenta cuenta)
        {
            cuentas.Add(cuenta);
        }

        public Cuenta? BuscarCuenta(int id)
        {
            foreach (var cuenta in cuentas)
            {
                if (cuenta.Id == id)
                {
                    return cuenta;
                }
            }
            return null;
        }

        public List<string> ListarCuentas()
        {
            List<string> listaCuentas = new List<string>();
            foreach (var cuenta in cuentas)
            {
                listaCuentas.Add(cuenta.ToString());
            }
            return listaCuentas;
        }
    }

    public class ExtraFunctions
    {
        public static int FloatToInt(string cantidad)
        {
            var partes = cantidad.Split('.');
            var cantidadEntera = int.Parse(partes[0]);
            var cantidadDecimal = partes.Length == 1 ? "00" : partes[1];
            return cantidadEntera * 100 + int.Parse(cantidadDecimal);
        }
        //public static void DeObjetoAArchivo(List<Cuenta> cuentas)
        //{
        //    using (var archivo = new StreamWriter("datos.txt"))
        //    {
        //        foreach (var cuenta in cuentas)
        //        {
        //            archivo.WriteLine($"{cuenta.Id} {cuenta.Nombre} {cuenta.Apellido1} {cuenta.Apellido2} {cuenta.Nacimiento} {cuenta.Saldo} {cuenta.Contrasena}");
        //        }
        //    }
        //}
        public static List<Cuenta> DeArchivoAObjeto()
        {
            var cuentas = new List<Cuenta>();
            var lineas = File.ReadAllLines("datos.txt");

            foreach (var linea in lineas)
            {
                var cuentaData = linea.Split(' ');
                var cuenta = new Cuenta(
                    int.Parse(cuentaData[0]),
                    cuentaData[1],
                    cuentaData[2],
                    cuentaData[3],
                    int.Parse(cuentaData[4]),
                    int.Parse(cuentaData[5]),
                    cuentaData[6]
                );
                cuentas.Add(cuenta);
            }

            return cuentas;
        }
    }


}
