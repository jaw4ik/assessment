using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.WooCommerce
{
    public class WooCommerceApiService : IWooCommerceApiService
    {
        private const string RegisterUserMethodPath = "api/user/create";
        private const string ServiceName = "wooCommerce";

        private readonly ConfigurationReader _configurationReader;
        private readonly HttpClient _httpClient;

        public WooCommerceApiService(ConfigurationReader configurationReader, HttpClient httpClient)
        {
            _configurationReader = configurationReader;
            _httpClient = httpClient;
        }

        public void RegisterUser(User user, string userPassword)
        {
            var methodUrl = GetServiceMethodUrl(RegisterUserMethodPath);
            var methodData = new
            {
                email = user.Email,
                firstname = user.FirstName,
                lastname = user.LastName,
                password = userPassword,
                organization = user.Organization,
                country = CountriesInfo.GetCountryCode(user.Country),
                phone = user.Phone
            };

            _httpClient.PostOrAddToQueueIfUnexpectedError(methodUrl, methodData, ServiceName);
        }

        private string GetServiceMethodUrl(string methodPath)
        {
            return string.Format("{0}/{1}?key={2}", _configurationReader.WooCommerceConfiguration.ServiceUrl, methodPath, _configurationReader.WooCommerceConfiguration.ApiKey);
        }
    }
}