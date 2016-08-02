using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents.SubscriptionEvents;
using easygenerator.Web.Synchronization.Broadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class UserEventHandler :
        IDomainEventHandler<UserDowngradedEvent>,
        IDomainEventHandler<UserUpgradedToStarterEvent>,
        IDomainEventHandler<UserUpgradedToPlusEvent>,
        IDomainEventHandler<UserUpgradedToAcademyEvent>,
        IDomainEventHandler<UserUpgradedToAcademyBTEvent>,
        IDomainEventHandler<UserUpgradedToTrialEvent>
    {
        private readonly IBroadcaster _broadcaster;

        public UserEventHandler(IBroadcaster broadcaster)
        {
            _broadcaster = broadcaster;
        }

        public void Handle(UserDowngradedEvent args)
        {
            _broadcaster.User(args.User.Email).userDowngraded();
        }

        public void Handle(UserUpgradedToStarterEvent args)
        {
            _broadcaster.User(args.User.Email).userUpgradedToStarter(args.User.ExpirationDate);
        }

        public void Handle(UserUpgradedToPlusEvent args)
        {
            _broadcaster.User(args.User.Email).userUpgradedToPlus(args.User.ExpirationDate);
        }

        public void Handle(UserUpgradedToAcademyEvent args)
        {
            _broadcaster.User(args.User.Email).userUpgradedToAcademy(args.User.ExpirationDate);
        }

        public void Handle(UserUpgradedToAcademyBTEvent args)
        {
            _broadcaster.User(args.User.Email).userUpgradedToAcademyBT(args.User.ExpirationDate);
        }

        public void Handle(UserUpgradedToTrialEvent args)
        {
            _broadcaster.User(args.User.Email).userUpgradedToTrial(args.User.ExpirationDate);
        }
    }
}