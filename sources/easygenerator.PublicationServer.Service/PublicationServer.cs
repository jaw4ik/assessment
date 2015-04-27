using easygenerator.PublicationServer.Configuration;
using easygenerator.PublicationServer.Extensions;
using easygenerator.PublicationServer.Filters;
using Microsoft.Owin.Hosting;
using Owin;
using System;
using System.Web.Http;

namespace easygenerator.PublicationServer
{
    public static class PublicationServerStartup
    {
        private static IDisposable _httpServerInstance;

        public static void Start()
        {
            var baseAddress = "http://*:777";
            _httpServerInstance = WebApp.Start(baseAddress, Configure);
        }

        public static void Stop()
        {
            if (_httpServerInstance != null)
            {
                _httpServerInstance.Dispose();
            }
        }

        private static void Configure(IAppBuilder appBuilder)
        {
            var config = new HttpConfiguration();

            ContainerConfiguration.Configure(config);
            RouteConfiguration.Configure(config);

            config.Filters.Add(config.DependencyResolver.GetService<GeneralExceptionFilterAttribute>());

            appBuilder.UseWebApi(config);
            appBuilder.UseFileServer();
            appBuilder.UseNancy();
        }
    }
}
