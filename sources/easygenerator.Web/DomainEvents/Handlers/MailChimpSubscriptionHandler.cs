using System;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;
using easygenerator.Web.Newsletter;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class MailChimpSubscriptionHandler : IDomainEventHandler<UserSignedUpEvent>,
        IDomainEventHandler<UserUpgradedToStarter>, IDomainEventHandler<UserUpgradedToPlus>, IDomainEventHandler<UserDowngraded>,
        IDomainEventHandler<UserUpgradedToAcademy>
    {
        private readonly INewsletterSubscriptionManager _subscriptionManager;
        private readonly IMailNotificationManager _mailNotificationManager;

        private const string CreateSubscriptionFailedMessage =
            "Something went wrong while trying to auto subscribe the new user";

        private const string UpdateSubscriptionFailedMessage =
            "Something went wrong while trying to send updated subscription for existing user";

        public MailChimpSubscriptionHandler(INewsletterSubscriptionManager subscriptionManager, IMailNotificationManager mailNotificationManager)
        {
            _subscriptionManager = subscriptionManager;
            _mailNotificationManager = mailNotificationManager;
        }

        public void Handle(UserUpgradedToStarter args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserUpgradedToPlus args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserUpgradedToAcademy args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserDowngraded args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserSignedUpEvent args)
        {
            HandleSubscriptionEvent(_subscriptionManager.CreateSubscription, args, CreateSubscriptionFailedMessage);
        }

        private void HandleSubscriptionEvent(Func<string, string, string, string, AccessType, string, bool> subscriptionAction, UserEvent args, string failureMessage)
        {
            Task.Run
               (() =>
               {
                   if (!subscriptionAction(args.User.Email, args.User.FirstName, args.User.LastName, args.User.Role, args.User.AccessType, args.User.Country))
                   {
                       _mailNotificationManager.AddMailNotificationToQueue(
                           Constants.MailTemplates.NewsletterSubscriptionFailedTemplate,
                           new
                           {
                               FailureMessage = failureMessage,
                               Email = args.User.Email,
                               FirstName = args.User.FirstName,
                               LastName = args.User.LastName,
                               Role = args.User.Role,
                               AccessType = args.User.AccessType,
                               Country = args.User.Country
                           });
                   }
               }
               );
        }
    }
}