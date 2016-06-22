using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Events.CourseEvents.Collaboration
{
    public class CourseCollaboratorAdminAccessGrantedEvent : CollaborationEvent
    {
        public CourseCollaboratorAdminAccessGrantedEvent(Course course, CourseCollaborator collaborator)
            : base(course, collaborator)
        {
        }
    }
}
