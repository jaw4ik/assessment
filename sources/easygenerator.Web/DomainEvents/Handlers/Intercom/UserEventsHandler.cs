using System;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Mail;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Components;

namespace easygenerator.Web.DomainEvents.Handlers.Intercom
{
    public class UserEventsHandler : 
        IDomainEventHandler<UserUpgradedToStarter>, 
        IDomainEventHandler<UserUpgradedToPlus>,
        IDomainEventHandler<UserUpgradedToAcademy>, 
        IDomainEventHandler<UserUpgradedToAcademyBT>, 
        IDomainEventHandler<UserDowngraded>
    {
        private readonly IMailNotificationManager _mailNotificationManager;
        private readonly IIntercomClient _intercomClient;
        private readonly ILog _logger;

        private const string UpdateSubscriptionFailedMessage =
            "Something went wrong while trying to send updated subscription for existing user";

        public UserEventsHandler(IMailNotificationManager mailNotificationManager, IIntercomClient intercomClient, ILog logger)
        {
            _mailNotificationManager = mailNotificationManager;
            _intercomClient = intercomClient;
            _logger = logger;
        }

        public void Handle(UserUpgradedToStarter args)
        {
            HandleSubscriptionEvent(args);
        }

        public void Handle(UserUpgradedToPlus args)
        {
            HandleSubscriptionEvent(args);
        }

        public void Handle(UserUpgradedToAcademy args)
        {
            HandleSubscriptionEvent(args);
        }

        public void Handle(UserUpgradedToAcademyBT args)
        {
            HandleSubscriptionEvent(args);
        }

        public void Handle(UserDowngraded args)
        {
            HandleSubscriptionEvent(args);
        }

        private void HandleSubscriptionEvent(UserEvent args)
        {
            if (args.User.Settings.IsCreatedThroughLti || _intercomClient.Client == null)
            {
                return;
            }

            Task.Run(() =>
            {
                if (!UpdateSubscription(args.User.Email, args.User.AccessType))
                {
                    _mailNotificationManager.AddMailNotificationToQueue(
                        Constants.MailTemplates.IntercomSubscriptionFailedTemplate,
                        new
                        {
                            FailureMessage = UpdateSubscriptionFailedMessage,
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

        private bool UpdateSubscription(string email, AccessType accessType)
        {
            try
            {
                var responseData = _intercomClient.Client.Users.Post(new
                {
                    email,
                    custom_attributes = new
                    {
                        plan = accessType.ToString()
                    }
                });

                return responseData != null;
            }
            catch (Exception exception)
            {
                _logger.LogException(exception);
                return false;
            }
        }
    }
}
