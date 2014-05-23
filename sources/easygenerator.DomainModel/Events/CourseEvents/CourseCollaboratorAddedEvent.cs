
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseCollaboratorAddedEvent
    {
        public CourseCollabrator Collaborator { get; private set; }
        public string AddedBy { get; private set; }

        public CourseCollaboratorAddedEvent(CourseCollabrator collaborator, string addedBy)
        {
            ThrowIfCourseCollabratorIsInvalid(collaborator);
            ThrowIfAddedByIsInvalid(addedBy);

            Collaborator = collaborator;
            AddedBy = addedBy;
        }

        private void ThrowIfCourseCollabratorIsInvalid(CourseCollabrator courseCollabrator)
        {
            ArgumentValidation.ThrowIfNull(courseCollabrator, "courseCollabrator");
        }

        private void ThrowIfAddedByIsInvalid(string addedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(addedBy, "addedBy");
        }
    }
}
