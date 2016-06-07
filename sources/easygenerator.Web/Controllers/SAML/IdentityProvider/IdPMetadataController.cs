using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Web.SAML.IdentityProvider.Providers;
using Kentor.AuthServices.Metadata;

namespace easygenerator.Web.Controllers.SAML.IdentityProvider
{
    [AllowAnonymous]
    public class IdPMetadataController : DefaultController
    {
        private readonly IMetadataProvider _metadataProvider;
        private readonly ICertificateProvider _certificateProvider;

        public IdPMetadataController(IMetadataProvider metadataProvider, ICertificateProvider certificateProvider)
        {
            _metadataProvider = metadataProvider;
            _certificateProvider = certificateProvider;
        }

        [Route("saml/idp/metadata")]
        public ActionResult Index()
        {
            return Content(_metadataProvider.GetIdpMetadata().ToXmlString(_certificateProvider.SigningCertificate),"application/samlmetadata+xml");
        }
    }
}
