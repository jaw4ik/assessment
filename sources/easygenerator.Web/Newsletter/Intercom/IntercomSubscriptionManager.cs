using System;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Newsletter.Intercom
{
    public class IntercomSubscriptionManager : IIntercomSubscriptionManager
    {
        private readonly ConfigurationReader _configurationReader;
        private readonly IIntercomClient _intercomClient;
        private readonly ILog _logger;

        public IntercomSubscriptionManager(ConfigurationReader configurationReader, IIntercomClient intercomClient, ILog logger)
        {
            _configurationReader = configurationReader;
            _intercomClient = intercomClient;
            _logger = logger;
        }

        public bool UpdateSubscription(string email, AccessType accesType)
        {
            if (string.IsNullOrEmpty(_configurationReader.IntercomConfiguration.AppId) ||
                string.IsNullOrEmpty(_configurationReader.IntercomConfiguration.ApiKey))
            {
                return true;
            }
            try
            {
                var plan = "";
                switch (accesType)
                {
                    case AccessType.Free:
                        {
                            plan = "Free";
                            break;
                        }
                    case AccessType.Starter:
                        {
                            plan = "Starter";
                            break;
                        }
                    case AccessType.Plus:
                        {
                            plan = "Plus";
                            break;
                        }
                    case AccessType.Academy:
                        {
                            plan = "Academy";
                            break;
                        }
                    case AccessType.AcademyBT:
                        {
                            plan = "AcademyBT";
                            break;
                        }
                    case AccessType.Trial:
                        {
                            plan = "Trial";
                            break;
                        }
                    default:
                        {
                            plan = "";
                            break;
                        }
                }
                var responseData = _intercomClient.Client.Users.Post(new
                    {
                        email,
                        custom_attributes = new
                        {
                            plan
                        }
                    });

                return responseData != null;
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                return false;
            }
        }
    }
}