using System.Threading.Tasks;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;

namespace easygenerator.Web.Domain.DomainEvents.Handlers
{
    public class SendMailAboutFeedbackFromUser : 
        IDomainEventHandler<UserFeedbackEvent>,
        IDomainEventHandler<NewEditorUserFeedbackEvent>
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

        public void Handle(NewEditorUserFeedbackEvent args)
        {
            Task.Run(() => _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.NewEditorFeedbackTemplate, args));
        }
    }
}