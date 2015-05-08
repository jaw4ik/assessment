using System.Linq;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;

namespace easygenerator.Web.Mail
{
    public class MailSenderTask : ITask
    {
        private readonly IMailSender _mailSender;
        private readonly IMailNotificationRepository _mailNotificationRepository;
        private readonly MailSettings _senderSettings;

        public MailSenderTask(IMailNotificationRepository mailRepository, IMailSender sender, MailSettings senderSettings)
        {
            _mailSender = sender;
            _mailNotificationRepository = mailRepository;
            _senderSettings = senderSettings;
        }

        public void Execute()
        {
            var mailNotifications = _mailNotificationRepository.GetCollection(_senderSettings.MailSenderSettings.BatchSize);
            if (mailNotifications == null || !mailNotifications.Any())
            {
                return;
            }

            foreach (var mailNotification in mailNotifications)
            {
                if (_mailSender.Send(mailNotification))
                {
                    _mailNotificationRepository.Remove(mailNotification);
                }
            }
        }
    }
}