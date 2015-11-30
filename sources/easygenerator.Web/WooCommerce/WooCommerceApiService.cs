using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.WooCommerce
{
    public class WooCommerceApiService : IWooCommerceApiService
    {
        private const string RegisterUserMethodPath = "api/user/create";
        private const string UpdateUserMethodPath = "api/user/update";
        private const string ServiceName = "wooCommerce";

        private readonly ConfigurationReader _configurationReader;
        private readonly IHttpRequestsManager _httpRequestsManager;

        public WooCommerceApiService(ConfigurationReader configurationReader, IHttpRequestsManager httpRequestsManager)
        {
            _configurationReader = configurationReader;
            _httpRequestsManager = httpRequestsManager;
        }

        public void RegisterUser(string userEmail, string firstname, string lastname, string userPassword, string country = null, string phone = null)
        {
            Post(userEmail, firstname, lastname, userPassword, country, phone, RegisterUserMethodPath);
        }

        public void UpdateUser(string userEmail, string firstname, string lastname, string userPassword, string country = null, string phone = null)
        {
            Post(userEmail, firstname, lastname, userPassword, country, phone, UpdateUserMethodPath);
        }

        private void Post(string userEmail, string firstname, string lastname, string userPassword, string country, string phone, string serviceMethodUrl)
        {
            if (_configurationReader.WooCommerceConfiguration.Enabled)
            {
                var methodUrl = GetServiceMethodUrl(serviceMethodUrl);
                var countryCode = country != null ? CountriesInfo.GetCountryCode(country) : null;

                var methodData = new
                {
                    email = userEmail,
                    firstname = firstname,
                    lastname = lastname,
                    password = userPassword,
                    country = countryCode,
                    phone = phone
                };

                _httpRequestsManager.PostOrAddToQueueIfUnexpectedError(methodUrl, methodData, ServiceName);
            }
        }

        private string GetServiceMethodUrl(string methodPath)
        {
            return string.Format("{0}/{1}?key={2}", _configurationReader.WooCommerceConfiguration.ServiceUrl, methodPath, _configurationReader.WooCommerceConfiguration.ApiKey);
        }
    }
}