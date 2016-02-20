using easygenerator.PublicationServer.Extensions;
using Microsoft.Owin;
using Microsoft.Owin.Extensions;
using Microsoft.Owin.StaticFiles;
using Microsoft.Owin.StaticFiles.ContentTypes;
using Owin;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.FileSystem;
using easygenerator.PublicationServer.Search;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.Configuration
{
    public static class StaticFilesConfiguration
    {
        private const string RootPath = ".\\courses";
        public static void Configure(HttpConfiguration config, IAppBuilder appBuilder)
        {
            appBuilder.UseStaticFiles("/content");

            var privatePublicationsFileServerOptions = new FileServerOptions
            {
                FileSystem = new PrivatePublicationsFileSystem(RootPath, config.DependencyResolver.GetService<PublicationPathProvider>()),
                RequestPath = new PathString(@""),
                EnableDefaultFiles = true
            };
            AddDefaultFileServerOptions(privatePublicationsFileServerOptions);
            appBuilder.UseFileServer(privatePublicationsFileServerOptions);

            var publicPublicationsFileServerOptions = new FileServerOptions()
            {
                FileSystem = new PublicPublicationsFileSystem(
                    RootPath,
                    config.DependencyResolver.GetService<PublicationPathProvider>(),
                    config.DependencyResolver.GetService<IPublicationRepository>(),
                    config.DependencyResolver.GetService<HttpUtilityWrapper>(),
                    config.DependencyResolver.GetService<SearchManager>()),
                RequestPath = new PathString($@"/{Constants.PublicPublicationsPath}"),
                EnableDefaultFiles = true
            };

            AddDefaultFileServerOptions(publicPublicationsFileServerOptions);
            appBuilder.UseFileServer(publicPublicationsFileServerOptions);

            appBuilder.UseStageMarker(PipelineStage.Authenticate);
        }

        private static void AddDefaultFileServerOptions(FileServerOptions fileServerOptions)
        {
            fileServerOptions.StaticFileOptions.DisableCache();

            var contentTypes = (FileExtensionContentTypeProvider)fileServerOptions.StaticFileOptions.ContentTypeProvider;
            contentTypes.Mappings[".json"] = "application/json";
            contentTypes.Mappings[".less"] = "text/css";
        }
    }
}
