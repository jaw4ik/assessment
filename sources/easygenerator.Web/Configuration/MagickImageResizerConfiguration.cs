using System;
using System.IO;
using System.Web.Mvc;
using easygenerator.Infrastructure.ImageProcessors;
using easygenerator.Web.Components.Configuration;
using System.Web;

namespace easygenerator.Web.Configuration
{
    public class MagickImageResizerConfiguration
    {
        public static void Configure()
        {
            var cacheDirectory = DependencyResolver.Current.GetService<ConfigurationReader>().MagickNetCacheDirectory;
            if (!String.IsNullOrEmpty(cacheDirectory))
            {
                var imageResizerConfigurator = DependencyResolver.Current.GetService<MagickImageResizerConfigurator>();
                imageResizerConfigurator.Configure(Path.IsPathRooted(cacheDirectory) ? cacheDirectory : HttpContext.Current.Server.MapPath(cacheDirectory));
            }
        }
    }
}