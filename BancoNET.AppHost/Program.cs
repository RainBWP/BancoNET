var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.BancoNET_ApiService>("apiservice");

builder.AddProject<Projects.BancoNET_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
