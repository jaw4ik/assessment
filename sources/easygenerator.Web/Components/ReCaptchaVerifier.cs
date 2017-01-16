using System.Collections.Generic;
using easygenerator.Web.Components.Configuration;
using HttpClient = easygenerator.Infrastructure.Http.HttpClient;

namespace easygenerator.Web.Components
{
    public interface IReCaptchaVerifier
    {
        bool Verify(string response, string remoteip);
    }

    public class ReCaptchaVerifier : IReCaptchaVerifier
    {
        private readonly HttpClient _httpClient;
        private readonly ReCaptchaConfigurationSection _reCaptchaConfiguration; 

        public ReCaptchaVerifier(HttpClient httpClient, ConfigurationReader configurationReader)
        {
            _httpClient = httpClient;
            _reCaptchaConfiguration = configurationReader.ReCaptchaConfiguration;
        }

        public bool Verify(string response, string remoteip)
        {
            if (string.IsNullOrEmpty(response))
            {
                return false;
            }
            var apiResponse = _httpClient.PostForm<IDictionary<string, string>>(_reCaptchaConfiguration.VerifyUrl, new[]
            {
                    new KeyValuePair<string, string>("secret", _reCaptchaConfiguration.SecretKey),
                    new KeyValuePair<string, string>("response", response),
                    new KeyValuePair<string, string>("remoteip", remoteip)
            }, new KeyValuePair<string,string>[]{});
            string success;
            if (apiResponse.TryGetValue(nameof(success), out success))
            {
                return success == "true";
            }
            return false;
        }
    }
}