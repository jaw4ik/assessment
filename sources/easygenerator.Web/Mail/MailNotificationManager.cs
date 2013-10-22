using System;
using easygenerator.DataAccess;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Web.Mail
{
    public interface IMailNotificationManager
    {
        void AddMailNotificationToQueue(string templateName, dynamic templateModel, string fromAddress = null);
    }

    public class MailNotificationManager : IMailNotificationManager
    {
        private readonly IEntityFactory _entityFactory;
        private readonly MailSettings _senderSettings;
        private readonly IMailNotificationRepository _mailNotificationRepository;
        private readonly IUnitOfWork _dataContext;

        public MailNotificationManager(IEntityFactory factory, IMailNotificationRepository mailNotificationRepository, IUnitOfWork unitOfWork, MailSettings senderSettings)
        {
            _entityFactory = factory;
            _senderSettings = senderSettings;
            _mailNotificationRepository = mailNotificationRepository;
            _dataContext = unitOfWork;
        }

        public void AddMailNotificationToQueue(string templateName, dynamic templateModel, string fromAddress = null)
        {
            var mailNotification = GetMailNotification(templateName, templateModel, fromAddress);
            _mailNotificationRepository.Add(mailNotification);
            _dataContext.Save();
        }

        private MailNotification GetMailNotification(string templateName, dynamic templateModel, string fromAddress = null)
        {
            var templateSettings = _senderSettings.MailTemplatesSettings[templateName];
            string emailBody = MailTemplatesProvider.GetMailTemplateBody(templateName, templateSettings, templateModel);

            // override from address from settings with address specified in method parameter
            string fromEmail = !String.IsNullOrWhiteSpace(fromAddress) ? fromAddress : templateSettings.From;
            return _entityFactory.MailNotification(emailBody, templateSettings.Subject, fromEmail,
                templateSettings.To, templateSettings.Cc, templateSettings.Bcc);
        }
    }
}
