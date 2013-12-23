using System.Web.Http;
using easygenerator.Web.Components.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.Web.Components.Http;
using easygenerator.Web.Newsletter.MailChimp.Entities;
using easygenerator.Web.Components;

namespace easygenerator.Web.Newsletter.MailChimp
{
    public class MailChimpSubscriptionManager : INewsletterSubscriptionManager
    {
        private const string GetListMethodPath = "lists/list";
        private const string SubscribeMethodPath = "lists/subscribe";

        private readonly ConfigurationReader _configurationReader;
        private readonly HttpHelper _httpHelper;

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

        public MailChimpSubscriptionManager(ConfigurationReader configurationReader, HttpHelper httpHelper)
        {
            _configurationReader = configurationReader;
            _httpHelper = httpHelper;
        }

        public bool SubscribeForNewsletters(string userEmail)
        {
            if (_configurationReader.MailChimpConfiguration.Enabled)
            {
                try
                {
                    var methodUrl = GetServiceMethodUrl(SubscribeMethodPath);
                    var responseData = _httpHelper.Post<object, MailChimpSubscription>(methodUrl,
                        new {apikey = ApiKey, id = ListIdForSubscription, email = new {email = userEmail}});
                    return string.Equals(responseData.Email, userEmail, StringComparison.CurrentCultureIgnoreCase);
                }
                catch (Exception exception)
                {
                    ElmahLog.LogException(exception);
                    return false;
                }
            }
            return true;
        }

        private string GetListIdForSubscription(string listName)
        {
            var methodUrl = GetServiceMethodUrl(GetListMethodPath);
            var responseData = _httpHelper.Post<object, MailChimpLists>(methodUrl, new { apikey = ApiKey, filters = new { list_name = listName } });

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