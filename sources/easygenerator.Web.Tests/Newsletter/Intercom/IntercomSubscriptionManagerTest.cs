using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.Newsletter.Intercom;

namespace easygenerator.Web.Tests.Newsletter.Intercom
{
    [TestClass]
    public class IntercomSubscriptionManagerTest
    {
        private IIntercomSubscriptionManager _subscriptionManager;
        private ConfigurationReader _configurationReader;
        private IntercomConfigurationSection _intercomConfiguration;
        private IIntercomClient _intercomClient;

        private const string emailToSubscribe = "test@easygenerator.com";
        private const AccessType accessType = AccessType.Starter;

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

            _intercomClient = Substitute.For<IntercomClient>();

            _subscriptionManager = new IntercomSubscriptionManager(_configurationReader, _intercomClient, Substitute.For<ILog>());
        }

        #region UpdateSubscription

        [TestMethod]
        public void UpdateSubscription_ShouldReturnTrueIfAppIdOrApiKeyIsNotProvided()
        {
            // Arrange
            _intercomConfiguration.AppId = "";
            _configurationReader.IntercomConfiguration.Returns(_intercomConfiguration);

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, accessType);

            // Assert
            result.Should().BeTrue();
        }

        #endregion
    }
}
