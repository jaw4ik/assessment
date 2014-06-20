using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CollaborationEvents;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting;

namespace easygenerator.Web.Synchronization.Handlers
{
    public class CollaborationEventHandler : IDomainEventHandler<CollaboratorRegisteredEvent>
    {
        private readonly IUsersCollaborationBroadcaster _collaborationBroadcaster;

        public CollaborationEventHandler(IUsersCollaborationBroadcaster collaborationBroadcaster)
        {
            _collaborationBroadcaster = collaborationBroadcaster;
        }

        public void Handle(CollaboratorRegisteredEvent args)
        {
            _collaborationBroadcaster.AllUserCollaborators(args.User.Email, args.SharedCourses)
                .collaboratorRegistered(args.User.Email, args.User.FullName);
        }
    }
}