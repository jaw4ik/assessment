using easygenerator.DataAccess;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Mail
{
    public class MailSenderTask : ITask
    {
        private readonly IMailSender _mailSender;
        private readonly IUnitOfWork _dataContext;
        private readonly IMailNotificationRepository _mailNotificationRepository;
        private readonly MailSettings _senderSettings;

        public MailSenderTask(IUnitOfWork unitOfWork, IMailNotificationRepository mailRepository, IMailSender sender, MailSettings senderSettings)
        {
            _dataContext = unitOfWork;
            _mailSender = sender;
            _mailNotificationRepository = mailRepository;
            _senderSettings = senderSettings;
        }

        public void Execute()
        {
            var mailNotifications = _mailNotificationRepository.GetCollection(_senderSettings.MailSenderSettings.BatchSize);
            if (mailNotifications == null)
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

            _dataContext.Save();
        }
    }
}