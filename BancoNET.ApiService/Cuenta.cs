namespace BancoNET.ApiService
{
    public class Cuenta
    {
        public int Id { get; }
        public string Nombre { get; }
        public string Apellido1 { get; }
        public string Apellido2 { get; }
        public int Nacimiento { get; }
        public int Saldo { get; private set; }
        private string Contrasena { get; }

        public Cuenta(int id, string nombre, string apellido1, string apellido2, int nacimiento, int saldo, string contrasena)
        {
            Id = id;
            Nombre = nombre;
            Apellido1 = apellido1;
            Apellido2 = apellido2;
            Nacimiento = nacimiento;
            Saldo = saldo;
            Contrasena = contrasena;
        }

        public bool PasswordCorrecta(string contrasena)
        {
            return Contrasena == contrasena;
        }

        public int ConsultarSaldo()
        {
            return Saldo;
        }

        public bool SacarDinero(int cantidad)
        {
            if (cantidad <= Saldo)
            {
                Saldo -= cantidad;
                return true;
            }
            return false;
        }

        public void IngresarDinero(int cantidad)
        {
            Saldo += cantidad;
        }

        public override string ToString()
        {
            return $"{Nombre} {Apellido1} {Apellido2}";
        }
    }
}
