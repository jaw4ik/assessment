using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CollaborationInviteDeclinedEvent : CollaborationEvent
    {
        public CollaborationInviteDeclinedEvent(Course course, CourseCollaborator collaborator)
            : base(course, collaborator)
        {
        }
    }
}
