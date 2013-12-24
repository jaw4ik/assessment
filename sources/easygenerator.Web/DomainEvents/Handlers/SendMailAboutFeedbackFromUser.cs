using System;
using easygenerator.DomainModel.Events;
using easygenerator.Infrastructure;
using easygenerator.Web.Mail;
using System.Threading.Tasks;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class SendMailAboutFeedbackFromUser : IDomainEventHandler<UserFeedbackEvent>
    {
        private readonly IMailNotificationManager _mailNotificationManager;

        public SendMailAboutFeedbackFromUser(IMailNotificationManager mailNotificationManager)
        {
            _mailNotificationManager = mailNotificationManager;
        }

        public void Handle(UserFeedbackEvent args)
        {
            Task.Run(() => _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.FeedbackTemplate, args));
        }
    }
}