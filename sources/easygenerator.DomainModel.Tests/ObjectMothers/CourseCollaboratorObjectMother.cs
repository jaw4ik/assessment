using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public static class CourseCollaboratorObjectMother
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const string UserEmail = "user@easygenerator.com";

        public static CourseCollaborator Create()
        {
            return new CourseCollaborator(CourseObjectMother.Create(), UserEmail, CreatedBy);
        }
        
        public static CourseCollaborator Create(Course course, string userEmail, string createdBy = CreatedBy)
        {
            return new CourseCollaborator(course, userEmail, createdBy);
        }

        public static CourseCollaborator CreateWithCourse(Course course)
        {
            return new CourseCollaborator(course, UserEmail, CreatedBy);
        }

        public static CourseCollaborator CreateWithCreatedBy(string createdBy)
        {
            return new CourseCollaborator(CourseObjectMother.Create(), UserEmail, createdBy);
        }

        public static CourseCollaborator CreateWithUserEmail(string userEmail)
        {
            return new CourseCollaborator(CourseObjectMother.Create(), userEmail, CreatedBy);
        }
    }
}
