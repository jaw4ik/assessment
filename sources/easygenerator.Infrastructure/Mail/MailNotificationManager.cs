using System;
using easygenerator.Infrastructure.DomainModel;

namespace easygenerator.Infrastructure.Mail
{
    public class MailNotificationManager : IMailNotificationManager
    {
        private readonly IMailSettings _senderSettings;
        private readonly IMailNotificationRepository _mailNotificationRepository;
        private readonly IUnitOfWork _dataContext;
        private readonly IMailTemplatesProvider _mailTemplatesProvider;

        public MailNotificationManager(IMailNotificationRepository mailNotificationRepository, IUnitOfWork unitOfWork, IMailSettings senderSettings, IMailTemplatesProvider mailTemplatesProvider)
        {
            _senderSettings = senderSettings;
            _mailNotificationRepository = mailNotificationRepository;
            _dataContext = unitOfWork;
            _mailTemplatesProvider = mailTemplatesProvider;
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
            string emailBody = _mailTemplatesProvider.GetMailTemplateBody(templateSettings, templateModel);

            // override from address from settings with address specified in method parameter
            string fromEmail = !String.IsNullOrWhiteSpace(fromAddress) ? fromAddress : templateSettings.From;
            return new MailNotification(emailBody, templateSettings.Subject, fromEmail,
                templateSettings.To, templateSettings.Cc, templateSettings.Bcc);
        }
    }
}
