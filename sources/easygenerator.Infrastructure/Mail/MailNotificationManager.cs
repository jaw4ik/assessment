using easygenerator.Infrastructure.DomainModel;
using static System.String;

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

        public void AddMailNotificationToQueue(string templateName, dynamic templateModel)
        {
            AddMailNotificationToQueue(templateName, templateModel, null, null);
        }


        public void AddMailNotificationToQueue(string templateName, dynamic templateModel, string subject, string fromAddress)
        {
            var templateSettings = _senderSettings.MailTemplatesSettings[templateName];
            string emailBody = _mailTemplatesProvider.GetMailTemplateBody(templateSettings, templateModel);

            _mailNotificationRepository.Add(new MailNotification(emailBody,
                !IsNullOrWhiteSpace(subject) ? subject : templateSettings.Subject,
                !IsNullOrWhiteSpace(fromAddress) ? fromAddress : templateSettings.From,
                templateSettings.To,
                templateSettings.Cc,
                templateSettings.Bcc));

            _dataContext.Save();
        }

    }
}