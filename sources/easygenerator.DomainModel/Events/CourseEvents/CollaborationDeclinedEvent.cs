using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CollaborationDeclinedEvent : CollaborationEvent
    {
        public CollaborationDeclinedEvent(Course course, CourseCollaborator collaborator)
            : base(course, collaborator)
        {
        }
    }
}
