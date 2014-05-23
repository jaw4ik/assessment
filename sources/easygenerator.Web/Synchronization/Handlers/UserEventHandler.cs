using easygenerator.DomainModel.Events;
using easygenerator.Web.Synchronization.Hubs;
using Microsoft.AspNet.SignalR;

namespace easygenerator.Web.Synchronization
{
    public class UserEventHandler : IDomainEventHandler<UserDonwgraded>, IDomainEventHandler<UserUpgradedToStarter>
    {
        private readonly IHubContext _hubContext;

        public UserEventHandler(IHubContext hubContext)
        {
            _hubContext = hubContext;
        }

        public UserEventHandler()
            : this(GlobalHost.ConnectionManager.GetHubContext<UserHub>())
        {

        }

        public void Handle(UserDonwgraded args)
        {
            _hubContext.Clients.User(args.User.Email).userDowngraded();
        }

        public void Handle(UserUpgradedToStarter args)
        {
            _hubContext.Clients.User(args.User.Email).userUpgradedToStarter(args.User.ExpirationDate);
        }
    }
}