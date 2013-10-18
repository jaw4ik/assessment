using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Mail;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class SendMailAboutNewUserHandler : IDomainEventHandler<UserSignedUpEvent>
    {
        private readonly MailNotificationManager _mailNotificationManager;

        public SendMailAboutNewUserHandler(MailNotificationManager mailNotificationManager)
        {
            _mailNotificationManager = mailNotificationManager;
        }

        public void Handle(UserSignedUpEvent args)
        {
            _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.SignedUpUserTemplate, args);
        }
    }
}