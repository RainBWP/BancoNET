using BancoNET.ApiService; // Add this line to include the namespace

var builder = WebApplication.CreateBuilder(args);
Banco banco = new Banco(); // Create Banco instance

// Add a few accounts to the bank from txt file
var cuentas = ExtraFunctions.DeArchivoAObjeto();
foreach (var cuenta in cuentas)
{
    banco.AgregarCuenta(cuenta);
}

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

// Add the BuscarCuenta endpoint
app.MapGet("/buscarcuenta/{id}", (int id) =>
{
    var cuenta = banco.BuscarCuenta(id);
    return cuenta != null ? Results.Ok(true) : Results.NotFound(false);
});

// Add the ConsultarSaldo endpoint
app.MapGet("/consultarsaldo/{id}/{password}", (int id, string password) =>
{
    var cuenta = banco.BuscarCuenta(id);
    if (cuenta != null)
    {
        return Results.Ok(cuenta.ConsultarSaldo());
    }
    return Results.NotFound();
});

// Add the SacarDinero endpoint
app.MapGet("/sacardinero/{id}/{password}/{cantidad}", (int id, string password, string cantidad) =>
{
    var cuenta = banco.BuscarCuenta(id);
    if (cuenta != null)
    {
        var cantidadInt = ExtraFunctions.FloatToInt(cantidad);
        if (cuenta.SacarDinero(cantidadInt))
        {
            return Results.Ok();
        }
    }
    return Results.NotFound();
});

// Add the IngresarDinero endpoint
app.MapGet("/ingresardinero/{id}/{password}/{cantidad}", (int id, string password, string cantidad) =>
{
    var cuenta = banco.BuscarCuenta(id);
    if (cuenta != null)
    {
        var cantidadInt = ExtraFunctions.FloatToInt(cantidad);
        cuenta.IngresarDinero(cantidadInt);
        return Results.Ok();
    }
    return Results.NotFound();
});

// add ObtenerNombre endpoint
app.MapGet("/obtenerNombre/{id}/{password}/", (int id, string password) =>
{
    var cuenta = banco.BuscarCuenta(id);
    if (cuenta != null)
    {
        var name = cuenta.ToString;
        return Results.Ok();
    }
    return Results.NotFound();
});

app.MapDefaultEndpoints();

app.Run();
