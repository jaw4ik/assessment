using System;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Newsletter.Intercom;

namespace easygenerator.Web.DomainEvents.Handlers
{
    public class IntercomSubscriptionHandler : IDomainEventHandler<UserUpgradedToStarter>, IDomainEventHandler<UserUpgradedToPlus>,
        IDomainEventHandler<UserUpgradedToAcademy>, IDomainEventHandler<UserUpgradedToAcademyBT>, IDomainEventHandler<UserDowngraded>
    {
        private readonly IIntercomSubscriptionManager _subscriptionManager;
        private readonly IMailNotificationManager _mailNotificationManager;

        private const string UpdateSubscriptionFailedMessage =
            "Something went wrong while trying to send updated subscription for existing user";

        public IntercomSubscriptionHandler(IIntercomSubscriptionManager subscriptionManager, IMailNotificationManager mailNotificationManager)
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

        public void Handle(UserUpgradedToAcademyBT args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        public void Handle(UserDowngraded args)
        {
            HandleSubscriptionEvent(_subscriptionManager.UpdateSubscription, args, UpdateSubscriptionFailedMessage);
        }

        private void HandleSubscriptionEvent(Func<string, AccessType, bool> subscriptionAction, UserEvent args, string failureMessage)
        {
            if (!args.User.Settings.IsCreatedThroughLti && !args.User.Settings.IsCreatedThroughSamlIdP)
            {
                Task.Run
                    (() =>
                    {
                        if (
                            !subscriptionAction(args.User.Email, args.User.AccessType))
                        {
                            _mailNotificationManager.AddMailNotificationToQueue(
                                Constants.MailTemplates.IntercomSubscriptionFailedTemplate,
                                new
                                {
                                    FailureMessage = failureMessage,
                                    args.User.Email,
                                    args.User.FirstName,
                                    args.User.LastName,
                                    args.User.Role,
                                    args.User.AccessType,
                                    args.User.Country
                                });
                        }
                    });
            }
        }
    }
}
