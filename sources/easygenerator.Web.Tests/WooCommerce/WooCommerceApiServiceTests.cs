using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Infrastructure.Mail;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.WooCommerce;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using HttpClient = easygenerator.Infrastructure.Http.HttpClient;

namespace easygenerator.Web.Tests.WooCommerce
{
    [TestClass]
    public class WooCommerceApiServiceTests
    {
        private ConfigurationReader _configurationReader;
        private HttpClient _httpClient;
        private WooCommerceApiService _wooCommerceApiService;

        [TestInitialize]
        public void InitializeService()
        {
            _configurationReader = Substitute.For<ConfigurationReader>();
            _httpClient = Substitute.For<HttpClient>(Substitute.For<IMailNotificationManager>(), Substitute.For<IHttpRequestsManager>(), Substitute.For<ILog>());
            _wooCommerceApiService = new WooCommerceApiService(_configurationReader, _httpClient);
        }

        [TestMethod]
        public void WooCommerceApiService_ShouldCallHttpClientPostOrAddToQueueMethodWithCorrectData()
        {
            // Arrange
            var user = UserObjectMother.CreateWithCountry("Ukraine");
            var password = "abcABC123";
            var serviceUrl = "serviceUrl";
            var methodPath = "api/user/create";
            var apiKey = "apiKey";
            var serviceName = "wooCommerce";

            var condigurationSection = new WooCommerceConfigurationSection { ServiceUrl = serviceUrl, ApiKey = apiKey };

            _configurationReader.WooCommerceConfiguration.Returns(condigurationSection);

            // Act
            _wooCommerceApiService.RegisterUser(user, password);

            // Assert
            _httpClient.Received().PostOrAddToQueueIfUnexpectedError(
                serviceUrl + "/" + methodPath + "?key=" + apiKey,
                Arg.Any<object>(),
                serviceName);
        }
    }
}
