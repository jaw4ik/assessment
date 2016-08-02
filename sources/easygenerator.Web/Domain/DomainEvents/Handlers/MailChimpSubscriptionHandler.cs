using System;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;
using easygenerator.Web.Newsletter;

namespace easygenerator.Web.Domain.DomainEvents.Handlers
{
    public class MailChimpSubscriptionHandler : IDomainEventHandler<UserSignedUpEvent>,
        IDomainEventHandler<UserUpgradedToStarterEvent>, IDomainEventHandler<UserUpgradedToPlusEvent>, IDomainEventHandler<UserDowngradedEvent>,
        IDomainEventHandler<UserUpgradedToAcademyEvent>, IDomainEventHandler<UserUpgradedToAcademyBTEvent>, IDomainEventHandler<UserUpgradedToTrialEvent>
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

        public void Handle(UserUpgradedToStarterEvent args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserUpgradedToPlusEvent args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserUpgradedToAcademyEvent args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserUpgradedToAcademyBTEvent args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserDowngradedEvent args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserUpgradedToTrialEvent args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserSignedUpEvent args)
        {
            HandleSubscriptionEvent(_subscriptionManager.CreateSubscription, args, CreateSubscriptionFailedMessage);
        }

        private void HandleSubscriptionEvent(Func<string, string, string, string, AccessType, string, bool> subscriptionAction, UserEvent args, string failureMessage)
        {
            if (!args.User.Settings.IsCreatedThroughLti && !args.User.Settings.IsCreatedThroughSamlIdP)
            {
                Task.Run(() =>
                {
                    if (
                        !subscriptionAction(args.User.Email, args.User.FirstName, args.User.LastName, args.User.Role,
                            args.User.AccessType, args.User.Country))
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
                });
            }
        }
    }
}