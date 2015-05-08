using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;
using System.Threading.Tasks;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class SendMailAboutNewUserHandler : IDomainEventHandler<UserSignedUpEvent>
    {
        private readonly IMailNotificationManager _mailNotificationManager;

        public SendMailAboutNewUserHandler(IMailNotificationManager mailNotificationManager)
        {
            _mailNotificationManager = mailNotificationManager;
        }

        public void Handle(UserSignedUpEvent args)
        {
            Task.Run(() => _mailNotificationManager.AddMailNotificationToQueue(Constants.MailTemplates.SignedUpUserTemplate, args, args.User.Email));
        }
    }
}