using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using easygenerator.Auth;
using easygenerator.Auth.Attributes;
using easygenerator.Auth.Attributes.Mvc;
using easygenerator.Auth.Configuration;
using easygenerator.Auth.Models;
using easygenerator.Auth.Providers;
using easygenerator.Auth.Repositories;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers
{
    public class AuthController : DefaultController
    {
        private readonly IUserRepository _repository;
        private readonly ITokenProvider _tokenProvider;
        private readonly IClientsRepository _clientsRepository;

        public AuthController(IUserRepository repository, ITokenProvider tokenProvider, IClientsRepository clientsRepository)
        {
            _repository = repository;
            _tokenProvider = tokenProvider;
            _clientsRepository = clientsRepository;
        }

        [HttpPost, AllowAnonymous]
        public ActionResult Token(string username, string password, string grant_type, string scope)
        {
            if (grant_type == "password")
            {
                var user = _repository.GetUserByEmail(username);
                if (user != null && user.VerifyPassword(password))
                {
                    var tokens = new List<TokenModel>();
                    var scopes = scope.Split(new string[] { " " }, StringSplitOptions.RemoveEmptyEntries);
                    var clients = _clientsRepository.GetCollection();
                    foreach (string scopeName in scopes)
                    {
                        var client =
                            clients.SingleOrDefault(t => t.Name.Equals(scopeName, StringComparison.OrdinalIgnoreCase));
                        if (client != null)
                        {
                            tokens.Add(new TokenModel()
                            {
                                Scope = client.Name,
                                Token = _tokenProvider.CreateToken(
                                    issuer: Request.Url.Host,
                                    audience: client.Audience,
                                    secret: client.Secret,
                                    claims: new List<Claim> {
                                        new Claim(ClaimTypes.Name, user.Email),
                                        new Claim(AuthorizationConfigurationProvider.ScopeClaimType, client.Name)
                                    }
                                )
                            });
                        }
                    }

                    return JsonSuccess(tokens);
                }
            }
            return JsonError(AccountRes.Resources.IncorrectEmailOrPassword);
        }

        [HttpPost, Scope("auth")]
        public ActionResult Identity()
        {
            var user = _repository.GetUserByEmail(GetCurrentUsername());

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
                subscription = new
                {
                    accessType = user.AccessType,
                    expirationDate = user.ExpirationDate
                }
            });

        }
    }
}
