using System.Collections.Generic;
using easygenerator.Auth.Models;

namespace easygenerator.Auth.Providers
{
    public interface ITokenProvider
    {
        List<TokenModel> GenerateTokens(string username, string issuer, IEnumerable<string> endpoints);
    }
}
