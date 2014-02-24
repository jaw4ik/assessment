using System.Activities;
using System.Activities.Statements;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Http;
using easygenerator.Web.Newsletter;
using easygenerator.Web.Newsletter.MailChimp;
using easygenerator.Web.Newsletter.MailChimp.Entities;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NSubstitute.Exceptions;

namespace easygenerator.Web.Tests.Newsletter.MailChimp
{
    [TestClass]
    public class MailChimpSubscriptionManagerTest
    {
        private INewsletterSubscriptionManager _subscriptionManager;
        private ConfigurationReader _configurationReader;
        private MailChimpConfigurationSection _mailChimpConfiguration;
        private HttpHelper _httpHelper;

        private const string emailToSubscribe = "test@easygenerator.com";
        private const string firstName = "firstName";
        private const string lastName = "lastName";
        private const string serviceUrl = "serviceUrl";
        private const string getListMethodPath = "serviceUrl/lists/list";
        private const string subscribeMethodPath = "serviceUrl/lists/subscribe";

        [TestInitialize]
        public void InitializeManager()
        {

            _configurationReader = Substitute.For<ConfigurationReader>();
            _httpHelper = Substitute.For<HttpHelper>();

            _mailChimpConfiguration = new MailChimpConfigurationSection()
            {
                ApiKey = "apiKey",
                ListName = "listName",
                ServiceUrl = serviceUrl
            };
            _configurationReader.MailChimpConfiguration.Returns(_mailChimpConfiguration);

            _subscriptionManager = new MailChimpSubscriptionManager(_configurationReader, _httpHelper);
        }

        [TestMethod]
        public void SubscribeForNewsletters_ShouldReturnTrueIfManagerEnabledIsFalse()
        {
            // Arrange
            _mailChimpConfiguration.Enabled = false;
            _configurationReader.MailChimpConfiguration.Returns(_mailChimpConfiguration);

            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void SubscribeForNewsletters_ShouldDoHttpPostToGetListId()
        {
            // Arrange
            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            _httpHelper.Received().Post<object, MailChimpLists>(Arg.Is(getListMethodPath), Arg.Any<object>());
        }

        [TestMethod]
        public void SubscribeForNewsletters_ShouldReturnFalseIfExceptionWasThrownWhileGettingListId()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists();
            mailChimpLists.Total = 0;

            _httpHelper.Post<object, MailChimpLists>(null, null).ReturnsForAnyArgs(_ => { throw new Exception(); });

            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            result.Should().BeFalse();
        }


        [TestMethod]
        public void SubscribeForNewsletters_ShouldReturnFalseIfListIsNotFound()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists();
            mailChimpLists.Total = 0;

            _httpHelper.Post<object, MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void SubscribeForNewsletters_ShouldReturnFalseIfMoreThanOneListWasFound()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists();
            mailChimpLists.Total = 2;

            _httpHelper.Post<object, MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void SubscribeForNewsletters_ShouldDoHttpPostToSubcribeEmail()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists();
            mailChimpLists.Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } };
            mailChimpLists.Total = 1;

            _httpHelper.Post<object, MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);

            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            _httpHelper.Received().Post<object, MailChimpSubscription>(Arg.Is(subscribeMethodPath), Arg.Any<object>());
        }

        [TestMethod]
        public void SubscribeForNewsletters_ShouldReturnFalseIfExceptionWhilePostingSubsciption()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists();
            mailChimpLists.Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } };
            mailChimpLists.Total = 1;

            _httpHelper.Post<object, MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);
            _httpHelper.Post<object, MailChimpSubscription>(null, null).ReturnsForAnyArgs(_ => { throw new Exception(); });

            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void SubscribeForNewsletters_ShouldReturnFalseIfEmailDoesntMatchWithEmailForSubscription()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists();
            mailChimpLists.Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } };
            mailChimpLists.Total = 1;

            _httpHelper.Post<object, MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);
            _httpHelper.Post<object, MailChimpSubscription>(null, null).Returns(new MailChimpSubscription() { Email = "someother@mail.com"} );

            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void SubscribeForNewsletters_ShouldReturnTrueIfEmailMatchEmailForSubscription()
        {
            // Arrange
            var mailChimpLists = new MailChimpLists();
            mailChimpLists.Data = new List<MailChimpList> { new MailChimpList() { Id = "listId", Name = "listName" } };
            mailChimpLists.Total = 1;

            _httpHelper.Post<object, MailChimpLists>(null, null).ReturnsForAnyArgs(mailChimpLists);
            _httpHelper.Post<object, MailChimpSubscription>(null, null).ReturnsForAnyArgs(new MailChimpSubscription() { Email = emailToSubscribe });

            // Act
            var result = _subscriptionManager.SubscribeForNewsletters(emailToSubscribe, firstName, lastName);

            // Assert
            result.Should().BeTrue();
        }
    }
}
