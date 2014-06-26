using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Web.Synchronization.Broadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class UserEventHandler : 
        IDomainEventHandler<UserDonwgraded>, 
        IDomainEventHandler<UserUpgradedToStarter>,
        IDomainEventHandler<UserUpgradedToPlus>
    {
        private readonly IBroadcaster _broadcaster;

        public UserEventHandler(IBroadcaster broadcaster)
        {
            _broadcaster = broadcaster;
        }

        public void Handle(UserDonwgraded args)
        {
            _broadcaster.User(args.User.Email).userDowngraded();
        }

        public void Handle(UserUpgradedToStarter args)
        {
            _broadcaster.User(args.User.Email).userUpgradedToStarter(args.User.ExpirationDate);
        }

        public void Handle(UserUpgradedToPlus args)
        {
            _broadcaster.User(args.User.Email).userUpgradedToPlus(args.User.ExpirationDate);
        }
    }
}