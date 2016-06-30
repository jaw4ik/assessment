using easygenerator.Web.Components.Configuration;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.Components;

namespace easygenerator.Web.Tests.Components
{
    [TestClass]
    public class IntercomClientTests
    {
        private ConfigurationReader _configurationReader;
        private IntercomConfigurationSection _intercomConfiguration;

        [TestInitialize]
        public void InitializeManager()
        {
            _configurationReader = Substitute.For<ConfigurationReader>();

            _intercomConfiguration = new IntercomConfigurationSection()
            {
                ServiceUrl = "serviceUrl",
                AppId = "appId",
                ApiKey = "apiKey"
            };
        }

        #region Constructor

        [TestMethod]
        public void Constructor_ShouldSetClientToNullIfNoAppIdOrApiKeyProvided()
        {
            // Arrange
            _configurationReader.IntercomConfiguration.Returns(new IntercomConfigurationSection()
            {
                ServiceUrl = "serviceUrl",
                AppId = "",
                ApiKey = ""
            });

            // Act
            var intercomClient = new IntercomClient(_configurationReader);

            // Assert
            intercomClient.Client.Should().BeNull();
        }

        [TestMethod]
        public void Constructor_ShouldSetClientToInstanceOfIntercomClientIfAppIdAndApiKeyProvided()
        {
            // Arrange
            _configurationReader.IntercomConfiguration.Returns(_intercomConfiguration);

            // Act
            var intercomClient = new IntercomClient(_configurationReader);

            // Assert
            intercomClient.Client.Should().NotBe(null);
        }

        #endregion
    }
}
