using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Security.Claims;
using easygenerator.Auth.Models;
using easygenerator.Auth.Repositories;


namespace easygenerator.Auth.Providers
{
    public class JsonWebTokenProvider : ITokenProvider
    {
        private readonly IEndpointsRepository _endpointsRepository;

        public JsonWebTokenProvider(IEndpointsRepository clientsRepository)
        {
            _endpointsRepository = clientsRepository;
        }

        public List<TokenModel> GenerateTokens(string username, string issuer, string endpoints)
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
                        Token = CreateToken(
                            issuer: issuer,
                            audience: endpoint.Audience,
                            secret: endpoint.Secret,
                            claims: new List<Claim> {
                                        new Claim(ClaimTypes.Name, username),
                                        new Claim(AuthorizationConfigurationProvider.ScopeClaimType, endpoint.Scopes)
                                    }
                        )
                    });
                }
            }

            return tokens;
        }

        private string CreateToken(string issuer, string audience, byte[] secret, IEnumerable<Claim> claims)
        {
            var jwtToken = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: new SigningCredentials(
                    signingKey: new InMemorySymmetricSecurityKey(secret),
                    signatureAlgorithm: SecurityAlgorithms.HmacSha256Signature,
                    digestAlgorithm: SecurityAlgorithms.HmacSha256Signature));

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(jwtToken);
        }
    }
}
