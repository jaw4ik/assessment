using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web.Mvc;
using easygenerator.Auth.Attributes.Mvc;
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
        private readonly IEndpointsRepository _endpointsRepository;

        public AuthController(IUserRepository repository, ITokenProvider tokenProvider, IEndpointsRepository clientsRepository)
        {
            _repository = repository;
            _tokenProvider = tokenProvider;
            _endpointsRepository = clientsRepository;
        }

        [HttpPost, AllowAnonymous]
        public ActionResult Token(string username, string password, string grant_type, string endpoints)
        {
            if (grant_type == "password")
            {
                var user = _repository.GetUserByEmail(username);
                if (user != null && user.VerifyPassword(password))
                {
                    var tokens = new List<TokenModel>();
                    var requestedEndpoints = endpoints.Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries);
                    var existingEndpoints = _endpointsRepository.GetCollection();
                    foreach (string endpointName in requestedEndpoints)
                    {
                        var endpoint =
                            existingEndpoints.SingleOrDefault(t => t.Name.Equals(endpointName, StringComparison.OrdinalIgnoreCase));
                        if (endpoint != null)
                        {
                            tokens.Add(new TokenModel()
                            {
                                Endpoint = endpoint.Name,
                                Token = _tokenProvider.CreateToken(
                                    issuer: Request.Url.Host,
                                    audience: endpoint.Audience,
                                    secret: endpoint.Secret,
                                    claims: new List<Claim> {
                                        new Claim(ClaimTypes.Name, user.Email),
                                        new Claim(AuthorizationConfigurationProvider.ScopeClaimType, endpoint.Scopes)
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
