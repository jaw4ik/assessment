using System.Collections.Generic;
using System.Security.Claims;

namespace easygenerator.Auth.Providers
{
    public interface ITokenProvider
    {
        string CreateToken(string issuer, string audience, byte[] secret, IEnumerable<Claim> claims);
    }
}
