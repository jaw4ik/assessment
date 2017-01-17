using easygenerator.Auth.Attributes.Mvc;
using easygenerator.Auth.Providers;
using easygenerator.Auth.Security.Models;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Components.Mappers.Organizations;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Extensions;
using System.Linq;
using System.Web.Mvc;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Security.BruteForceLoginProtection;

namespace easygenerator.Web.Controllers
{
    public class AuthController : DefaultController
    {
        private readonly IUserRepository _repository;
        private readonly ITokenProvider _tokenProvider;
        private readonly IReleaseNoteFileReader _releaseNoteFileReader;
        private readonly IEntityModelMapper<Company> _companyMapper;
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IOrganizationMapper _organizationMapper;
        private readonly IOrganizationUserRepository _organizationUserRepository;
        private readonly IOrganizationInviteMapper _organizationInviteMapper;
        private readonly ISamlServiceProviderRepository _samlServiceProviderRepository;
        private readonly ISurveyPopupSettingsProvider _surveyPopupVersionReader;
        private readonly IIPInfoProvider _ipInfoProvider;
        private readonly IReCaptchaVerifier _reCaptchaVerifier;
        private readonly IBruteForceLoginProtectionManager _bruteForceLoginProtectionManager;
        private readonly ConfigurationReader _configurationReader;

        public AuthController(IUserRepository repository, ITokenProvider tokenProvider, IReleaseNoteFileReader releaseNoteFileReader, IEntityModelMapper<Company> companyMapper,
            IOrganizationRepository organizationRepository, IOrganizationMapper organizationMapper, IOrganizationUserRepository organizationUserRepository,
            IOrganizationInviteMapper organizationInviteMapper, ISamlServiceProviderRepository samlServiceProviderRepository, ISurveyPopupSettingsProvider surveyPopupVersionReader,
            IIPInfoProvider ipInfoProvider, IReCaptchaVerifier reCaptchaVerifier, IBruteForceLoginProtectionManager bruteForceLoginProtectionManager, ConfigurationReader configurationReader)
        {
            _repository = repository;
            _tokenProvider = tokenProvider;
            _releaseNoteFileReader = releaseNoteFileReader;
            _companyMapper = companyMapper;
            _organizationRepository = organizationRepository;
            _organizationMapper = organizationMapper;
            _organizationUserRepository = organizationUserRepository;
            _organizationInviteMapper = organizationInviteMapper;
            _samlServiceProviderRepository = samlServiceProviderRepository;
            _surveyPopupVersionReader = surveyPopupVersionReader;
            _ipInfoProvider = ipInfoProvider;
            _reCaptchaVerifier = reCaptchaVerifier;
            _bruteForceLoginProtectionManager = bruteForceLoginProtectionManager;
            _configurationReader = configurationReader;
        }

        [HttpPost, AllowAnonymous]
        public ActionResult Token(string username, string password, string grant_type, string[] endpoints, string grecaptchaResponse)
        {
            if (grant_type != "password")
            {
                return JsonError(ViewsResources.Resources.IncorrectEmailOrPassword);
            }
            var user = _repository.GetUserByEmail(username);
            if (user == null)
            {
                return JsonError(ViewsResources.Resources.IncorrectEmailOrPassword);
            }
            var ip = _ipInfoProvider.GetIP(HttpContext);
            if (_bruteForceLoginProtectionManager.IsRequiredCaptcha(username, ip) && !_reCaptchaVerifier.Verify(grecaptchaResponse, ip))
            {
                return new HttpStatusCodeResult(400, Errors.CaptchaVerificationFailed);
            }
            if (!user.VerifyPassword(password))
            {
                _bruteForceLoginProtectionManager.StoreFailedAttempt(username, ip);
                return JsonError(ViewsResources.Resources.IncorrectEmailOrPassword);
            }
            var tokens = _tokenProvider.GenerateTokens(username, Request.Url.Host, endpoints);
            return JsonSuccess(tokens);
        }

        //TODO: check brute force after this method will be used
        [HttpPost, AllowAnonymous, CustomRequireHttps, WebApiKeyAccess("ExternalAuthToken")]
        public ActionResult ExternalAuthToken(string username, string password, string grant_type)
        {
            if (grant_type == "password")
            {
                var user = _repository.GetUserByEmail(username);
                if (user != null && user.VerifyPassword(password))
                {
                    var tokens = _tokenProvider.GenerateTokens(username, Request.Url.Host, new[] { "externalAuth" }, DateTimeWrapper.Now().ToUniversalTime().AddMinutes(5));
                    return JsonSuccess(tokens);
                }
            }
            return JsonError(ViewsResources.Resources.IncorrectEmailOrPassword);
        }

        [HttpPost, Scope("lti", "samlAuth", "externalAuth")]
        public ActionResult Tokens(string[] endpoints)
        {
            var tokens = _tokenProvider.GenerateTokens(GetCurrentUsername(), Request.Url.Host, endpoints);
            return JsonSuccess(tokens);
        }

        [HttpPost, Scope("auth")]
        public ActionResult Identity()
        {
            var user = _repository.GetUserByEmail(GetCurrentUsername());
            var releaseVersion = _releaseNoteFileReader.GetReleaseVersion();
            var surveyPopupVersion = _surveyPopupVersionReader.SurveyPopupVersion;
            var surveyPopupPageUrl = _surveyPopupVersionReader.SurveyPopupPageUrl;
            var surveyPopupOriginUrl = _surveyPopupVersionReader.SurveyPopupOriginUrl;
            var numberOfDaysUntilShowUp = _surveyPopupVersionReader.SurveyPopupNumberOfDaysUntilShowUp;

            if (user == null)
            {
                return JsonError(Errors.UserWithSpecifiedEmailDoesntExist);
            }

            return JsonSuccess(new
            {
                email = user.Email,
                firstname = user.FirstName,
                lastname = user.LastName,
                role = user.Role,
                phone = string.IsNullOrEmpty(CountriesInfo.GetCountryPhoneCode(user.Country)) ? "" + user.Phone ?? "" : CountriesInfo.GetCountryPhoneCode(user.Country) + user.Phone ?? "",
                companies = user.Companies.Select(e => _companyMapper.Map(e)),
                organizations = _organizationRepository.GetAcceptedOrganizations(user.Email).Select(e => _organizationMapper.Map(e, user.Email)),
                organizationInvites = _organizationUserRepository.GetOrganizationInvites(GetCurrentUsername()).Select(invite => _organizationInviteMapper.Map(invite)),
                subscription = new
                {
                    accessType = user.AccessType,
                    expirationDate = user.ExpirationDate
                },
                showReleaseNote = releaseVersion != user.Settings.LastReadReleaseNote,
                showSurveyPopup = user.Settings.LastPassedSurveyPopup != surveyPopupVersion && user.CreatedOn.AddDays(numberOfDaysUntilShowUp) <= DateTimeWrapper.Now()
                    && !string.IsNullOrEmpty(surveyPopupPageUrl) && !string.IsNullOrEmpty(surveyPopupOriginUrl),
                newEditor = user.Settings.NewEditor,
                isCreatedThroughLti = user.Settings.IsCreatedThroughLti,
                isCreatedThroughSamlIdP = user.Settings.IsCreatedThroughSamlIdP,
                isCoggnoSamlServiceProviderAllowed = user.IsAllowed(
                    _samlServiceProviderRepository.GetByAssertionConsumerService(_configurationReader.CoggnoConfiguration.AssertionConsumerServiceUrl)
                ),
                isNewEditorByDefault = user.Settings.IsNewEditorByDefault,
                includeMediaToPackage = user.Settings.IncludeMediaToPackage
            });

        }

        [HttpPost, Scope("auth")]
        public ActionResult IdentifyLtiUser(LtiUserInfoSecure ltiUserInfoSecure)
        {
            var ltiUserInfo = ltiUserInfoSecure.GetObject();
            var user = _repository.GetUserByEmail(GetCurrentUsername());

            if (ltiUserInfo.User != user)
                return JsonSuccess(new { unauthorized = true });

            user.AddLtiUserInfo(ltiUserInfo);
            var company = ltiUserInfo.ConsumerTool.Settings?.Company;

            if (company == null)
                return JsonSuccess();

            user.AddCompany(company, GetCurrentUsername());
            return JsonSuccess(new { companyId = company.Id.ToNString() });
        }

        [HttpPost, Scope("auth")]
        public ActionResult IdentifySamlUser(SamlIdPUserInfoSecure samlIdPUserInfoSecure)
        {
            var samlIdPUserInfo = samlIdPUserInfoSecure.GetObject();
            var user = _repository.GetUserByEmail(GetCurrentUsername());

            if (samlIdPUserInfo.User != user)
                return JsonSuccess(new { unauthorized = true });

            user.AddSamlIdPUserInfo(samlIdPUserInfo);
            return JsonSuccess();
        }
    }
}
