using System.Linq;
using easygenerator.Auth.Attributes.Mvc;
using easygenerator.Auth.Providers;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Mappers;
using System.Web.Mvc;
using easygenerator.Auth.Security.Models;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers
{
    public class AuthController : DefaultController
    {
        private readonly IUserRepository _repository;
        private readonly ITokenProvider _tokenProvider;
        private readonly IReleaseNoteFileReader _releaseNoteFileReader;
        private readonly IEntityModelMapper<Company> _companyMapper;

        public AuthController(IUserRepository repository, ITokenProvider tokenProvider, IReleaseNoteFileReader releaseNoteFileReader, IEntityModelMapper<Company> companyMapper)
        {
            _repository = repository;
            _tokenProvider = tokenProvider;
            _releaseNoteFileReader = releaseNoteFileReader;
            _companyMapper = companyMapper;
        }

        [HttpPost, AllowAnonymous]
        public ActionResult Token(string username, string password, string grant_type, string[] endpoints)
        {
            if (grant_type == "password")
            {
                var user = _repository.GetUserByEmail(username);
                if (user != null && user.VerifyPassword(password))
                {
                    var tokens = _tokenProvider.GenerateTokens(username, Request.Url.Host, endpoints);
                    return JsonSuccess(tokens);
                }
            }
            return JsonError(ViewsResources.Resources.IncorrectEmailOrPassword);
        }

        [HttpPost, Scope("lti")]
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
                phone = string.IsNullOrEmpty(CountriesInfo.GetCountryPhoneCode(user.Country)) ? ""  + user.Phone ?? "": CountriesInfo.GetCountryPhoneCode(user.Country) + user.Phone ?? "",
                companies = user.Companies.Select(e => _companyMapper.Map(e)),
                subscription = new
                {
                    accessType = user.AccessType,
                    expirationDate = user.ExpirationDate
                },
                showReleaseNote = releaseVersion != user.Settings.LastReadReleaseNote,
                newEditor = user.Settings.NewEditor,
                isCreatedThroughLti = user.Settings.IsCreatedThroughLti,
                isNewEditorByDefault = user.Settings.IsNewEditorByDefault
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
    }
}
