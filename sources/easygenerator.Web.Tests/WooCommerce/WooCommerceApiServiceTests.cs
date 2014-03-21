﻿using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.WooCommerce;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;

namespace easygenerator.Web.Tests.WooCommerce
{
    [TestClass]
    public class WooCommerceApiServiceTests
    {
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        private ConfigurationReader _configurationReader;
        private IHttpRequestsManager _httpRequestsManager;
        private WooCommerceApiService _wooCommerceApiService;

        [TestInitialize]
        public void InitializeService()
        {
            _configurationReader = Substitute.For<ConfigurationReader>();
            _httpRequestsManager = Substitute.For<IHttpRequestsManager>();
            _wooCommerceApiService = new WooCommerceApiService(_configurationReader, _httpRequestsManager);

            DateTimeWrapper.Now = () => CurrentDate;
        }

        [TestMethod]
        public void WooCommerceApiService_ShouldCallHttpClientPostOrAddToQueueMethodWithCorrectData()
        { 
            // Arrange
            var user = UserObjectMother.CreateWithCountry("Ukraine");
            var serviceUrl = "serviceUrl";
            var methodPath = "api/user/create";
            var apiKey = "apiKey";
            var serviceName = "wooCommerce";

            var condigurationSection = new WooCommerceConfigurationSection { ServiceUrl = serviceUrl, ApiKey = apiKey };

            _configurationReader.WooCommerceConfiguration.Returns(condigurationSection);

            // Act
            _wooCommerceApiService.RegisterUser(user, "abcABC123");

            // Assert
            _httpRequestsManager.Received().PostOrAddToQueueIfUnexpectedError(
                serviceUrl + "/" + methodPath + "?key=" + apiKey,
                Arg.Any<object>(),
                serviceName);
        }

        [TestMethod]
        public void WooCommerceApiService_ShouldNotCallHttpClientIfEnableIsFalse()
        {
            // Arrange
            var condigurationSection = new WooCommerceConfigurationSection { ServiceUrl = "serviceUrl", ApiKey = "apiKey", Enabled = false };
            _configurationReader.WooCommerceConfiguration.Returns(condigurationSection);

            // Act
            _wooCommerceApiService.RegisterUser(UserObjectMother.CreateWithCountry("Ukraine"), "abcABC123");

            // Assert
            _httpRequestsManager.DidNotReceive().PostOrAddToQueueIfUnexpectedError(Arg.Any<string>(), Arg.Any<object>(), Arg.Any<string>());
        }
    }
}
