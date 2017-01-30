using System;
using System.Web;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components.Configuration;
using Newtonsoft.Json;

namespace easygenerator.Web.Components.Slack
{
    public class SlackClient
    {
        private readonly HttpClient _httpClient;
        private readonly ConfigurationReader _configurationReader;

        public SlackClient() { }
        public SlackClient(HttpClient httpClient, ConfigurationReader configurationReader)
        {
            _httpClient = httpClient;
            _configurationReader = configurationReader;
        }

        public virtual void PostMessage(string text, string username = null, string channel = null)
        {
            var payload = new Payload()
            {
                Channel = channel,
                Username = username,
                Text = text
            };

            PostMessage(payload);
        }

        private void PostMessage(Payload message)
        {
            if (!_configurationReader.SlackConfigurationSection.Enabled)
                return;

            _httpClient.Post<object>(
                _configurationReader.SlackConfigurationSection.WebhookUrl, JsonConvert.SerializeObject(message));

        }
    }
}