using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Components.Configuration.ApiKeys;
using easygenerator.Web.Components.Slack;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Components.Slack
{
    [TestClass]
    public class SlackClientTests
    {
        private SlackClient _slackClient;
        private const string SlackWebhookUrl = "service/url";

        private HttpClient _httpClient;
        private ConfigurationReader _configurationReader;

        private SlackConfigurationSection _slackConfiguration;

        [TestInitialize]
        public void InitializeContext()
        {
            _httpClient = Substitute.For<HttpClient>();
            _configurationReader = Substitute.For<ConfigurationReader>();

            _slackClient = new SlackClient(_httpClient, _configurationReader);

            _slackConfiguration = new SlackConfigurationSection() { WebhookUrl = SlackWebhookUrl }; 
            _configurationReader.SlackConfigurationSection.Returns(_slackConfiguration);
        }

        #region PostMessage

        [TestMethod]
        public void PostMessage_WhenSlackIsEnabledAndAllParametersSet_ShouldCallHttpClientPostMethodWithParameters()
        {
            const string text = "test message";
            const string username = "test user";
            const string channel = "test chanel";

            _slackConfiguration.Enabled = true;
            _slackClient.PostMessage(text, username, channel);
            _httpClient.Received().Post<object>(Arg.Is(SlackWebhookUrl), Arg.Is<object>((_) => _.IsObjectSimilarTo("{\"channel\":\"" + channel + "\",\"username\":\"" + username + "\",\"text\":\"" + text + "\"}")));
        }

        [TestMethod]
        public void PostMessage_WhenSlackIsEnabledAndAllParametersNotSet_ShouldCallHttpClientPostMethodWithDefaultParameters()
        {
            const string text = "test message";
            
            _slackConfiguration.Enabled = true;
            _slackClient.PostMessage(text);
            _httpClient.Received().Post<object>(Arg.Is(SlackWebhookUrl), Arg.Is<object>((_) => _.IsObjectSimilarTo("{\"channel\":null,\"username\":null,\"text\":\"" + text + "\"}")));
        }

        [TestMethod]
        public void PostMessage_WhenSlackIsNotEnabled_ShouldNotCallHttpClientPostMethod()
        {
            _slackConfiguration.Enabled = false;
            _slackClient.PostMessage("test");
            _httpClient.DidNotReceive().Post<object>(Arg.Is(SlackWebhookUrl), Arg.Any<Dictionary<string, string>>());
        }

        #endregion
    }
}
