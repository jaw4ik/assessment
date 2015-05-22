using easygenerator.Infrastructure.ImageProcessors;
using easygenerator.Web.Components.Configuration;
using System.Web.Mvc;

namespace easygenerator.Web.Configuration
{
    public class MagickImageResizerConfiguration
    {
        public static void Configure()
        {
            var configurationReader = DependencyResolver.Current.GetService<ConfigurationReader>();
            MagickImageResizer.Configure(configurationReader.MagickNetCacheDirectory);
        }
    }
}