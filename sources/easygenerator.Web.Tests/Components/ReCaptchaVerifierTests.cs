using System.Collections.Generic;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components
{
    [TestClass]
    public class ReCaptchaVerifierTests
    {
        private IReCaptchaVerifier _reCaptchaVerifier;
        private HttpClient _httpClient;
        private ReCaptchaConfigurationSection _reCaptchaConfiguration;
        private ConfigurationReader _configurationReader;
        private IDictionary<string, string> _googleResponse;

        [TestInitialize]
        public void InitializeContext()
        {
            _httpClient = Substitute.For<HttpClient>();
            _reCaptchaConfiguration = new ReCaptchaConfigurationSection
            {
                VerifyUrl = "https://www.google.com",
                SecretKey = "123465789"
            };
            _googleResponse = new Dictionary<string, string>();

            _httpClient.PostForm<IDictionary<string, string>>(_reCaptchaConfiguration.VerifyUrl,
                Arg.Any<IEnumerable<KeyValuePair<string, string>>>(),
                Arg.Any<IEnumerable<KeyValuePair<string, string>>>()).Returns(_googleResponse);

            _configurationReader = Substitute.For<ConfigurationReader>();
            _configurationReader.ReCaptchaConfiguration.Returns(_reCaptchaConfiguration);
            _reCaptchaVerifier = new ReCaptchaVerifier(_httpClient, _configurationReader);
        }

        #region Verify

        [TestMethod]
        public void Verify_ShouldReturnFalseIfResponseIsNullOrEmpty()
        {
            _reCaptchaVerifier.Verify("", "127.0.0.1").Should().Be(false);

        }

        [TestMethod]
        public void Verify_ShouldReturnFalseIfResponseSuccessIsFalse()
        {
            _googleResponse.Remove("success");
            _googleResponse.Add("success", "false");

            _reCaptchaVerifier.Verify("response", "127.0.0.1").Should().Be(false);

            _httpClient.Received().PostForm<IDictionary<string, string>>(_reCaptchaConfiguration.VerifyUrl,
                Arg.Any<IEnumerable<KeyValuePair<string, string>>>(),
                Arg.Any<IEnumerable<KeyValuePair<string, string>>>());
        }

        [TestMethod]
        public void Verify_ShouldReturnTrueIfResponseSuccessIsTrue()
        {
            _googleResponse.Remove("success");
            _googleResponse.Add("success", "true");

            _reCaptchaVerifier.Verify("response", "127.0.0.1").Should().Be(true);

            _httpClient.Received().PostForm<IDictionary<string, string>>(_reCaptchaConfiguration.VerifyUrl,
                Arg.Any<IEnumerable<KeyValuePair<string, string>>>(),
                Arg.Any<IEnumerable<KeyValuePair<string, string>>>());
        }

        #endregion
    }
}
