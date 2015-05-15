
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CollaborationInviteAcceptedEvent : CollaborationEvent
    {
        public CollaborationInviteAcceptedEvent(Course course, CourseCollaborator collaborator)
            : base(course, collaborator)
        {
        }
    }
}
