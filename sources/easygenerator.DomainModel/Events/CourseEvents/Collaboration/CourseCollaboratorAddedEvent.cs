using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents.Collaboration
{
    public class CourseCollaboratorAddedEvent : Event
    {
        public CourseCollaborator Collaborator { get; private set; }

        public CourseCollaboratorAddedEvent(CourseCollaborator collaborator)
        {
            ThrowIfCourseCollabratorIsInvalid(collaborator);

            Collaborator = collaborator;
        }

        private void ThrowIfCourseCollabratorIsInvalid(CourseCollaborator courseCollaborator)
        {
            ArgumentValidation.ThrowIfNull(courseCollaborator, "courseCollabrator");
        }
    }
}
