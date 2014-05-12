using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CourseCollaboratorObjectMother
    {
        private const string CreatedBy = "username@easygenerator.com";

        public static CourseCollabrator CreateWithCourse(Course course)
        {
            return new CourseCollabrator(course, UserObjectMother.Create(), CreatedBy);
        }

        public static CourseCollabrator Create(Course course, User user, string createdby = CreatedBy)
        {
            return new CourseCollabrator(course, user, createdby);
        }
    }
}
