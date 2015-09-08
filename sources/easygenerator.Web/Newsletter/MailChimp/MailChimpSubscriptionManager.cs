using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components.Configuration;
using System;
using easygenerator.Web.Newsletter.MailChimp.Entities;

namespace easygenerator.Web.Newsletter.MailChimp
{
    public class MailChimpSubscriptionManager : INewsletterSubscriptionManager
    {
        private const string GetListMethodPath = "lists/list";
        private const string SubscribeMethodPath = "lists/subscribe";
        private const string UpdateSubscriptionMethodPath = "lists/update-member";
        private const bool confirmationRequired = false;

        private readonly ConfigurationReader _configurationReader;
        private readonly HttpClient _httpClient;
        private readonly ILog _logger;

        private string _listId;
        private string ListIdForSubscription
        {
            get
            {
                if (string.IsNullOrEmpty(_listId))
                {
                    _listId = GetListIdForSubscription(_configurationReader.MailChimpConfiguration.ListName);
                }
                return _listId;
            }
        }

        private string ApiKey
        {
            get
            {
                return _configurationReader.MailChimpConfiguration.ApiKey;
            }
        }

        public MailChimpSubscriptionManager(ConfigurationReader configurationReader, HttpClient httpClient, ILog logger)
        {
            _configurationReader = configurationReader;
            _httpClient = httpClient;
            _logger = logger;
        }

        public bool CreateSubscription(string userEmail, string firstname, string lastname, string userRole, AccessType accessType, string country)
        {
            return SendSubscriptionRequest(SubscribeMethodPath, userEmail, firstname, lastname, userRole, accessType, country);
        }

        public bool UpdateSubscription(string userEmail, string firstname, string lastname, string userRole, AccessType accessType, string country)
        {
            return SendSubscriptionRequest(UpdateSubscriptionMethodPath, userEmail, firstname, lastname, userRole, accessType, country);
        }

        private bool SendSubscriptionRequest(string methodPath, string userEmail, string firstname, string lastname, string userRole, AccessType accessType, string country)
        {
            if (_configurationReader.MailChimpConfiguration.Enabled)
            {
                try
                {
                    var methodUrl = GetServiceMethodUrl(methodPath);
                    var responseData = _httpClient.Post<MailChimpSubscription>(methodUrl,
                        new
                        {
                            apikey = ApiKey,
                            id = ListIdForSubscription,
                            email = new { email = userEmail },
                            merge_vars = new { fname = firstname, lname = lastname, role = userRole, plan = accessType.ToString(), country = country },
                            double_optin = confirmationRequired
                        });
                    return string.Equals(responseData.Email, userEmail, StringComparison.CurrentCultureIgnoreCase);
                }
                catch (Exception exception)
                {
                    _logger.LogException(exception);
                    return false;
                }
            }
            return true;
        }

        private string GetListIdForSubscription(string listName)
        {
            var methodUrl = GetServiceMethodUrl(GetListMethodPath);
            var responseData = _httpClient.Post<MailChimpLists>(methodUrl, new { apikey = ApiKey, filters = new { list_name = listName } });

            if (responseData.Total > 1)
            {
                throw new InvalidOperationException(string.Format("MailChimp lists sequence contains more than one element with listname: {0}.", listName));
            }

            if (responseData.Total == 0)
            {
                throw new InvalidOperationException(string.Format("MailChimp lists sequence doesn't contain list with name: {0}.", listName));
            }

            return responseData.Data[0].Id;
        }

        private string GetServiceMethodUrl(string methodPath)
        {
            return string.Format("{0}/{1}", _configurationReader.MailChimpConfiguration.ServiceUrl, methodPath);
        }
    }
}