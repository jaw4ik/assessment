using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Newsletter;
using easygenerator.Web.Newsletter.MailChimp;
using easygenerator.Web.Newsletter.MailChimp.Entities;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.Newsletter.MailChimp
{
    [TestClass]
    public class MailChimpSubscriptionManagerTest
    {
        private INewsletterSubscriptionManager _subscriptionManager;
        private ConfigurationReader _configurationReader;
        private MailChimpConfigurationSection _mailChimpConfiguration;
        private HttpClient _httpClient;

        private const string emailToSubscribe = "test@easygenerator.com";
        private const string firstName = "firstName";
        private const string lastName = "lastName";
        private const string role = "Teacher";
        private const string serviceUrl = "serviceUrl";
        private const string getListMethodPath = "serviceUrl/lists/list";
        private const string subscribeMethodPath = "serviceUrl/lists/subscribe";
        private const string updateMethodPath = "serviceUrl/lists/update-member";
        private const AccessType accessType = AccessType.Starter;
        private const string country = "Ukraine";

        [TestInitialize]
        public void InitializeManager()
        {
            _configurationReader = Substitute.For<ConfigurationReader>();
            _httpClient = Substitute.For<HttpClient>();

            _mailChimpConfiguration = new MailChimpConfigurationSection()
            {
                ApiKey = "apiKey",
                ListName = "listName",
                ServiceUrl = serviceUrl
            };
            _configurationReader.MailChimpConfiguration.Returns(_mailChimpConfiguration);

            _subscriptionManager = new MailChimpSubscriptionManager(_configurationReader, _httpClient, Substitute.For<ILog>());
        }

        #region CreateSubscription

        [TestMethod]
        public void CreateSubscription_ShouldReturnTrueIfManagerEnabledIsFalse()
        {
            // Arrange
            _mailChimpConfiguration.Enabled = false;
            _configurationReader.MailChimpConfiguration.Returns(_mailChimpConfiguration);

            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void CreateSubscription_ShouldDoHttpPostToGetListId()
        {
            // Arrange
            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            _httpClient.Received().Post<MailChimpLists>(Arg.Is(getListMethodPath), Arg.Any<object>());
        }

        [TestMethod]
        public void CreateSubscription_ShouldReturnFalseIfExceptionWasThrownWhileGettingListId()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists { Total = 0 };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(_ => { throw new Exception(); });

            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void CreateSubscription_ShouldReturnFalseIfListIsNotFound()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists { Total = 0 };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void CreateSubscription_ShouldReturnFalseIfMoreThanOneListWasFound()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists { Total = 2 };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void CreateSubscription_ShouldDoHttpPostToSubcribeEmail()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists
            {
                Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } },
                Total = 1
            };

            _httpClient.Post<MailChimpLists>(null, (object)null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            _httpClient.Received().Post<MailChimpSubscription>(Arg.Is(subscribeMethodPath), Arg.Any<object>());
        }

        [TestMethod]
        public void CreateSubscription_ShouldReturnFalseIfExceptionWhilePostingSubsciption()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists
            {
                Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } },
                Total = 1
            };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);
            _httpClient.Post<MailChimpSubscription>(null, null).ReturnsForAnyArgs(_ => { throw new Exception(); });

            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void CreateSubscription_ShouldReturnFalseIfEmailDoesntMatchWithEmailForSubscription()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists
            {
                Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } },
                Total = 1
            };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);
            _httpClient.Post<MailChimpSubscription>(null, null).Returns(new MailChimpSubscription() { Email = "someother@mail.com" });

            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void CreateSubscription_ShouldReturnTrueIfEmailMatchEmailForSubscription()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists
            {
                Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } },
                Total = 1
            };

            _httpClient.Post<MailChimpLists>(null, (object)null).ReturnsForAnyArgs(mailChimpLists);
            _httpClient.Post<MailChimpSubscription>(null, (object)null).ReturnsForAnyArgs(new MailChimpSubscription() { Email = emailToSubscribe });

            // Act
            var result = _subscriptionManager.CreateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeTrue();
        }

        #endregion

        #region UpdateSubscription

        [TestMethod]
        public void UpdateSubscription_ShouldReturnTrueIfManagerEnabledIsFalse()
        {
            // Arrange
            _mailChimpConfiguration.Enabled = false;
            _configurationReader.MailChimpConfiguration.Returns(_mailChimpConfiguration);

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void UpdateSubscription_ShouldDoHttpPostToGetListId()
        {
            // Arrange
            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            _httpClient.Received().Post<MailChimpLists>(Arg.Is(getListMethodPath), Arg.Any<object>());
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnFalseIfExceptionWasThrownWhileGettingListId()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists { Total = 0 };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(_ => { throw new Exception(); });

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnFalseIfListIsNotFound()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists { Total = 0 };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnFalseIfMoreThanOneListWasFound()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists { Total = 2 };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void UpdateSubscription_ShouldDoHttpPostToSubcribeEmail()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists
            {
                Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } },
                Total = 1
            };

            _httpClient.Post<MailChimpLists>(null, (object)null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            _httpClient.Received().Post<MailChimpSubscription>(Arg.Is(updateMethodPath), Arg.Any<object>());
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnFalseIfExceptionWhilePostingSubsciption()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists
            {
                Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } },
                Total = 1
            };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);
            _httpClient.Post<MailChimpSubscription>(null, null).ReturnsForAnyArgs(_ => { throw new Exception(); });

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnFalseIfEmailDoesntMatchWithEmailForSubscription()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists
            {
                Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } },
                Total = 1
            };

            _httpClient.Post<MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);
            _httpClient.Post<MailChimpSubscription>(null, null).Returns(new MailChimpSubscription() { Email = "someother@mail.com" });

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void UpdateSubscription_ShouldReturnTrueIfEmailMatchEmailForSubscription()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists
            {
                Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } },
                Total = 1
            };

            _httpClient.Post<MailChimpLists>(null, (object)null).ReturnsForAnyArgs(mailChimpLists);
            _httpClient.Post<MailChimpSubscription>(null, (object)null).ReturnsForAnyArgs(new MailChimpSubscription() { Email = emailToSubscribe });

            // Act
            var result = _subscriptionManager.UpdateSubscription(emailToSubscribe, firstName, lastName, role, accessType, country);

            // Assert
            result.Should().BeTrue();
        }

        #endregion
    }
}
