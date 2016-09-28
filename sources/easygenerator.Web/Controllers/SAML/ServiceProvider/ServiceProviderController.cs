using System;
using System.IdentityModel.Metadata;
using System.Linq;
using System.Web;
using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Auth.Providers;
using easygenerator.Auth.Security.Models;
using easygenerator.Auth.Security.Providers;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.SAML;
using easygenerator.Web.SAML.ServiceProvider.Models;
using easygenerator.Web.SAML.ServiceProvider.Providers;
using Kentor.AuthServices.HttpModule;
using Kentor.AuthServices.WebSso;

namespace easygenerator.Web.Controllers.SAML.ServiceProvider
{
    [AllowAnonymous]
    public class ServiceProviderController : DefaultController
    {
        private readonly ICommandProvider _commandProvider;
        private readonly ICommandRunner _commandRunner;
        private readonly ISignInCommandRunner _signInCommandRunner;
        private readonly IOptionsProvider _optionsProvider;
        private readonly IUserRepository _userRepository;
        private readonly ISamlIdentityProviderRepository _samlIdentityProviderRepository;
        private readonly IEntityFactory _entityFactory;
        private readonly ITokenProvider _tokenProvider;
        private readonly IDomainEventPublisher _domainEventPublisher;
        private readonly IReleaseNoteFileReader _releaseNoteFileReader;
        private readonly ISecureTokenProvider<ISecure<SamlIdPUserInfo>> _secureTokenProvider;
        private readonly ISurveyPopupSettingsProvider _surveyPopupVersionReader;

        public ServiceProviderController(ICommandProvider commandProvider, ICommandRunner commandRunner, ISignInCommandRunner signInCommandRunner, IOptionsProvider optionsProvider,
            IUserRepository userRepository, ISamlIdentityProviderRepository samlIdentityProviderRepository, IEntityFactory entityFactory, ITokenProvider tokenProvider, IDomainEventPublisher domainEventPublisher,
            IReleaseNoteFileReader releaseNoteFileReader, ISecureTokenProvider<ISecure<SamlIdPUserInfo>> secureTokenProvider, ISurveyPopupSettingsProvider surveyPopupVersionReader)
        {
            _commandProvider = commandProvider;
            _commandRunner = commandRunner;
            _signInCommandRunner = signInCommandRunner;
            _optionsProvider = optionsProvider;
            _userRepository = userRepository;
            _samlIdentityProviderRepository = samlIdentityProviderRepository;
            _entityFactory = entityFactory;
            _tokenProvider = tokenProvider;
            _domainEventPublisher = domainEventPublisher;
            _releaseNoteFileReader = releaseNoteFileReader;
            _secureTokenProvider = secureTokenProvider;
            _surveyPopupVersionReader = surveyPopupVersionReader;
        }

        [Route("saml/sp/login/{idP}")]
        public ActionResult Login(string idP)
        {
            var samlIdp = _samlIdentityProviderRepository.GetByName(idP);
            if (samlIdp == null)
            {
                throw new ArgumentNullException(nameof(samlIdp));
            }
            return RedirectToAction("SignIn", new { idp = HttpUtility.UrlEncode(samlIdp.EntityId) });
        }

        public ActionResult Index()
        {
            var command = _commandProvider.GetMetadataCommand();
            var result = _commandRunner.Run(command, Request, _optionsProvider.Options);
            ThrowIfResultIsInvalid(result);
            return result.ToActionResult();
        }

        public ActionResult SignIn()
        {
            var idp = HttpUtility.UrlDecode(Request.QueryString["idp"]);
            var returnUrl = HttpUtility.UrlDecode(Request.QueryString["ReturnUrl"]);
            ArgumentValidation.ThrowIfNullOrEmpty(idp, nameof(idp));

            var result = _signInCommandRunner.Run(new EntityId(idp), returnUrl, Request, _optionsProvider.Options);
            ThrowIfResultIsInvalid(result);
            result.ApplyCookies(Response);
            return result.ToActionResult();
        }

        public ActionResult Acs()
        {
            var command = _commandProvider.GetAcsCommand();
            var result = _commandRunner.Run(command, Request, _optionsProvider.Options);
            ThrowIfResultIsInvalid(result);

            var identifierClaim = result.Principal.FindFirst(p => SPClaimTypes.Email.Contains(p.Type));
            var issuer = identifierClaim?.Issuer;
            var email = identifierClaim?.Value;

            ArgumentValidation.ThrowIfNullOrEmpty(issuer, nameof(issuer));
            ArgumentValidation.ThrowIfNullOrEmpty(email, nameof(email));

            var samlIdP = _samlIdentityProviderRepository.GetByEntityId(issuer);
            if (samlIdP == null)
            {
                throw new ArgumentNullException(nameof(samlIdP));
            }
            var user = _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                var firstName = result.Principal.FindFirst(p => SPClaimTypes.FirstName.Contains(p.Type))?.Value;
                ArgumentValidation.ThrowIfNullOrEmpty(firstName, nameof(firstName));
                var lastName = result.Principal.FindFirst(p => SPClaimTypes.LastName.Contains(p.Type))?.Value;
                ArgumentValidation.ThrowIfNullOrEmpty(lastName, nameof(lastName));
                CreateNewUser(email, firstName, lastName, samlIdP);
            }
            else
            {
                if (user.GetSamlIdPUserInfo(samlIdP) == null)
                {
                    var samlIdPUserInfo = _entityFactory.SamlIdPUserInfo(samlIdP, user);
                    var samlIdPUserInfoSecure = new SamlIdPUserInfoSecure(samlIdPUserInfo);
                    var token = HttpUtility.UrlEncode(_secureTokenProvider.GenerateToken(samlIdPUserInfoSecure));
                    return Redirect($"{result.Location.OriginalString}#token.user.saml={token}");
                }
            }

            var authToken = _tokenProvider.GenerateTokens(email, Request.Url?.Host, new[] { "samlAuth" }, DateTimeWrapper.Now().ToUniversalTime().AddMinutes(5));
            var redirectUrl = $"{result.Location.OriginalString}#token.samlAuth={authToken[0].Token}";
            return Redirect(redirectUrl);
        }

        private void CreateNewUser(string email, string firstName, string lastName, SamlIdentityProvider idP)
        {
            const string samlMockData = "SAML";
            const int trialPeriodDays = 14;
            var userPassword = Guid.NewGuid().ToString("N");

            var user = _entityFactory.User(email, userPassword, firstName, lastName, samlMockData, samlMockData, samlMockData, email, AccessType.Trial,
                _releaseNoteFileReader.GetReleaseVersion(), _surveyPopupVersionReader.SurveyPopupVersion, DateTimeWrapper.Now().AddDays(trialPeriodDays), false, true, null, null);

            user.AddSamlIdPUserInfo(idP);
            _userRepository.Add(user);

            _domainEventPublisher.Publish(new UserSignedUpEvent(user, userPassword));
            _domainEventPublisher.Publish(new CreateUserInitialDataEvent(user));
        }

        private static void ThrowIfResultIsInvalid(CommandResult result)
        {
            if (result == null) throw new ArgumentNullException(nameof(result));
            if (result.HandledResult)
            {
                throw new NotSupportedException("The MVC controller doesn't support setting CommandResult.HandledResult.");
            }
        }
    }
}
