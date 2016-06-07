using System.Linq;
using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Auth.Attributes.Mvc;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.SAML;
using easygenerator.Web.SAML.IdentityProvider.Models;
using easygenerator.Web.SAML.IdentityProvider.Providers;
using Kentor.AuthServices.Saml2P;
using Kentor.AuthServices.WebSso;
using Kentor.AuthServices.HttpModule;

namespace easygenerator.Web.Controllers.SAML.IdentityProvider
{
    public class IdPAuthController : DefaultController
    {
        private readonly IUserRepository _repository;
        private readonly ISaml2ResponseProvider _saml2ResponseProvider;

        public IdPAuthController(IUserRepository repository, ISaml2ResponseProvider saml2ResponseProvider)
        {
            _repository = repository;
            _saml2ResponseProvider = saml2ResponseProvider;
        }

        [Route("saml/idp/auth")]
        [Scope("saml")]
        public ActionResult Index()
        {
            var requestData = Request.ToHttpRequestData(true);
            if (!requestData.QueryString["SAMLRequest"].Any()) return BadRequest();
            var extractedMessage = Saml2Binding.Get(Saml2BindingType.HttpRedirect).Unbind(requestData, null);
            var request = new Saml2AuthenticationRequest(extractedMessage.Data, extractedMessage.RelayState);

            var user = _repository.GetUserByEmail(GetCurrentUsername());
            if (user == null)
            {
                return JsonError(Errors.UserWithSpecifiedEmailDoesntExist);
            }

            var model = new AssertionModel
            {
                NameId = user.Email,
                InResponseTo = request.Id.Value,
                AssertionConsumerServiceUrl = request.AssertionConsumerServiceUrl.ToString(),
                RelayState = extractedMessage.RelayState,
                Audience = request.Issuer.Id
            };
            var userAttributes = new UserAttributesModel(user.FirstName, user.LastName, user.FullName);
            model.AttributeStatements.Add(userAttributes.GivenName);
            model.AttributeStatements.Add(userAttributes.Surname);
            model.AttributeStatements.Add(userAttributes.FullName);

            var response = _saml2ResponseProvider.CreateSaml2Response(model);
            return Saml2Binding.Get(Saml2BindingType.HttpPost).Bind(response).ToActionResult();
        }
    }
}
