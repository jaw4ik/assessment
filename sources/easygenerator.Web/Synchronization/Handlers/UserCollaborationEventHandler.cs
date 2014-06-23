using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.UserEvents;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class UserCollaborationEventHandler : IDomainEventHandler<UserSignedUpEvent>
    {
        private readonly IUserCollaborationBroadcaster _broadcaster;

        public UserCollaborationEventHandler(IUserCollaborationBroadcaster broadcaster)
        {
            _broadcaster = broadcaster;
        }

        public void Handle(UserSignedUpEvent args)
        {
            _broadcaster.AllUserCollaborators(args.User.Email)
                .collaboratorRegistered(args.User.Email, args.User.FullName);
        }
    }
}