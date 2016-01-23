using easygenerator.PublicationServer.Extensions;
using Microsoft.Owin;
using Microsoft.Owin.Extensions;
using Microsoft.Owin.StaticFiles;
using Microsoft.Owin.StaticFiles.ContentTypes;
using Owin;
using System.Web.Http;

namespace easygenerator.PublicationServer.Configuration
{
    public static class StaticFilesConfiguration
    {
        public static void Configure(HttpConfiguration config, IAppBuilder appBuilder)
        {
            appBuilder.UseStaticFiles("/content");

            var fileServerOptions = new FileServerOptions()
            {
                FileSystem = new PublicationFileServer(".\\courses", (PublicationPathProvider)config.DependencyResolver.GetService(typeof(PublicationPathProvider))),
                RequestPath = new PathString(@""),
                EnableDefaultFiles = true
            };
            fileServerOptions.StaticFileOptions.DisableCache();

            var contentTypes = (FileExtensionContentTypeProvider)fileServerOptions.StaticFileOptions.ContentTypeProvider;
            contentTypes.Mappings[".json"] = "application/json";
            contentTypes.Mappings[".less"] = "text/css";

            appBuilder.UseFileServer(fileServerOptions);

            appBuilder.UseStageMarker(PipelineStage.Authenticate);
        }
    }
}
