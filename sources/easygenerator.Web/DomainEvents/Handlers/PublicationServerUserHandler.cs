using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using System;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class PublicationServerUserHandler : IDomainEventHandler<UserSignedUpEvent>, IDomainEventHandler<UserUpdateEvent>
    {
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly HttpClient _httpClient;
        private readonly ConfigurationReader _configurationReader;
        private readonly ILog _logger;
        private readonly IMailNotificationManager _mailNotificationManager;

        private const string CreateUserMethodName = "create";
        private const string UpdateUserMethodName = "update";

        public PublicationServerUserHandler(IUrlHelperWrapper urlHelper, HttpClient httpClient, ConfigurationReader configurationReader, ILog logger, IMailNotificationManager mailNotificationManager)
        {
            _httpClient = httpClient;
            _urlHelper = urlHelper;
            _configurationReader = configurationReader;
            _logger = logger;
            _mailNotificationManager = mailNotificationManager;
        }

        public void Handle(UserSignedUpEvent args)
        {
            Handle(CreateUserMethodName, args.User.Email, args.User.AccessType);
        }

        public void Handle(UserUpdateEvent args)
        {
            Handle(UpdateUserMethodName, args.User.Email, args.User.AccessType);
        }

        private void Handle(string methodName, string email, AccessType accessType)
        {
            try
            {
                _httpClient.PostForm<string>(
                    GetPublishMethodPath(methodName, email, accessType), formValues:
                    new[] {
                        new KeyValuePair<string, string>("email", email),
                        new KeyValuePair<string, string>("accessType", accessType.ToString())
                    });

            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.PublicationServerUserRequestFailedTemplate,
                    new { Verb = methodName, Email = email, AccessType = accessType });
            }
        }
        private string GetPublishMethodPath(string method, string email, AccessType accessType)
        {
            return _urlHelper.AddCurrentSchemeToUrl($"{_configurationReader.PublicationConfiguration.ServiceUrl}/api/user/{method}?key={_configurationReader.PublicationConfiguration.ApiKey}&email={email}&accessType={(int)accessType}");
        }
    }
}