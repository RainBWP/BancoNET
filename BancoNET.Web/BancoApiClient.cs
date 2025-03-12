using BancoNET.ApiService;
using System.Net.Http.Json;

namespace BancoNET.Web
{
    public class BancoApiClient(HttpClient httpClient)
    {
        private readonly HttpClient _httpClient = httpClient;

        public async Task<bool> BuscarCuentaAsync(int id)
        {
            var response = await _httpClient.GetAsync($"/buscarcuenta/{id}");
            return response.IsSuccessStatusCode;
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
            var response = await _httpClient.GetAsync($"/sacardinero/{id}/{password}/{cantidad}");
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> IngresarDineroAsync(int id, string password, string cantidad)
        {
            var response = await _httpClient.GetAsync($"/ingresardinero/{id}/{password}/{cantidad}");
            return response.IsSuccessStatusCode;
        }

        public async Task<string?> ObtenerNombreAsync(int id, string password)
        {
            var response = await _httpClient.GetAsync($"/obtenerNombre/{id}/{password}/");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            return null;
        }
    }
}
