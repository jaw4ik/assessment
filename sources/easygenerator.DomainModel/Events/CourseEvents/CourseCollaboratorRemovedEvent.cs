using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Events.CourseEvents
{
    public class CourseCollaboratorRemovedEvent : CourseEvent
    {
        public CourseCollaborator Collaborator { get; private set; }

        public CourseCollaboratorRemovedEvent(Course course, CourseCollaborator collaborator)
            : base(course)
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
