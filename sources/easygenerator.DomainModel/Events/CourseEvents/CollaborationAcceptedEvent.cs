
using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CollaborationAcceptedEvent : CollaborationEvent
    {
        public CollaborationAcceptedEvent(Course course, CourseCollaborator collaborator)
            : base(course, collaborator)
        {
        }
    }
}
