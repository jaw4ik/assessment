
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseCollaboratorAddedEvent
    {
        public CourseCollaborator Collaborator { get; private set; }
        public string AddedBy { get; private set; }

        public CourseCollaboratorAddedEvent(CourseCollaborator collaborator, string addedBy)
        {
            ThrowIfCourseCollabratorIsInvalid(collaborator);
            ThrowIfAddedByIsInvalid(addedBy);

            Collaborator = collaborator;
            AddedBy = addedBy;
        }

        private void ThrowIfCourseCollabratorIsInvalid(CourseCollaborator courseCollaborator)
        {
            ArgumentValidation.ThrowIfNull(courseCollaborator, "courseCollabrator");
        }

        private void ThrowIfAddedByIsInvalid(string addedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(addedBy, "addedBy");
        }
    }
}
