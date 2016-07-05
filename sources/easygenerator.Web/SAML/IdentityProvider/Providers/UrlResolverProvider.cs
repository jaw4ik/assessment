using System;
using System.Linq;
using System.Web;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.SAML.IdentityProvider.Providers
{
    public class UrlResolverProvider: IUrlResolverProvider
    {
        private readonly HttpContextBase _httpContext;
        private readonly ConfigurationReader _configurationReader;

        public UrlResolverProvider(HttpContextBase httpContext, ConfigurationReader configurationReader)
        {
            _httpContext = httpContext;
            _configurationReader = configurationReader;
        }

        public Uri RootUrl => GetCombinedUrl(_configurationReader.SamlIdPConfiguration.RootPath);
        public Uri SsoServiceUrl => GetCombinedUrl(_configurationReader.SamlIdPConfiguration.SsoServicePath);
        public Uri MetadataUrl => GetCombinedUrl(_configurationReader.SamlIdPConfiguration.MetadataPath);
        public Uri LogoutServiceUrl => string.IsNullOrEmpty(_configurationReader.SamlIdPConfiguration.LogoutServicePath) ? null :
            GetCombinedUrl(_configurationReader.SamlIdPConfiguration.LogoutServicePath);

        private Uri GetCombinedUrl(string path)
        {
            var applicationPathSegmentsCount = new Uri(_httpContext.Request.Url, _httpContext.Request.ApplicationPath ?? "").Segments.Length;
            var namedIdpSegment = _httpContext.Request.Url.Segments.Skip(applicationPathSegmentsCount).FirstOrDefault(); // find guid part if any
            if (!string.IsNullOrEmpty(namedIdpSegment) && !namedIdpSegment.EndsWith("/"))
            {
                namedIdpSegment = namedIdpSegment + "/";
            }
            Guid parsedGuid;
            if (!string.IsNullOrEmpty(namedIdpSegment) && Guid.TryParse(namedIdpSegment.TrimEnd('/'), out parsedGuid))
            {
                return new Uri(_httpContext.Request.Url, _httpContext.Request.ApplicationPath + namedIdpSegment + path);
            }
            return new Uri(_httpContext.Request.Url, _httpContext.Request.ApplicationPath + path);
        }
    }
}
