using BancoNET.ApiService;
using System.Net.Http.Json;

namespace BancoNET.Web
{
    public class BancoApiClient
    {
        private readonly HttpClient _httpClient;

        public BancoApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<Cuenta?> BuscarCuentaAsync(int id)
        {
            var response = await _httpClient.GetAsync($"/buscarcuenta/{id}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Cuenta>();
            }
            return null;
        }

        public async Task<decimal?> ConsultarSaldoAsync(int id, string password)
        {
            var response = await _httpClient.GetAsync($"/consultarsaldo/{id}/{password}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<decimal>();
            }
            return null;
        }

        public async Task<bool> SacarDineroAsync(int id, string password, string cantidad)
        {
            var response = await _httpClient.PostAsync($"/sacardinero/{id}/{password}/{cantidad}", null);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> IngresarDineroAsync(int id, string password, string cantidad)
        {
            var response = await _httpClient.PostAsync($"/ingresardinero/{id}/{password}/{cantidad}", null);
            return response.IsSuccessStatusCode;
        }

        public async Task<string?> ObtenerNombreAsync(int id, string password)
        {
            var response = await _httpClient.PostAsync($"/obtenerNombre/{id}/{password}/", null);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            return null;
        }
    }
}
