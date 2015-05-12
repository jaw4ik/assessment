using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseCollaboratorRemovedEvent : CollaborationEvent
    {
        public CourseCollaboratorRemovedEvent(Course course, CourseCollaborator collaborator)
            : base(course, collaborator)
        {
        }
    }
}
