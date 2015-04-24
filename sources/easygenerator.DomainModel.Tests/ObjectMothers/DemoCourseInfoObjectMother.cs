using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class DemoCourseInfoObjectMother
    {
        private const string CreatedBy = "username@easygenerator.com";

        public static DemoCourseInfo Create(Course sourceCourse = null, Course demoCourse = null, string createdBy = CreatedBy)
        {
            if (sourceCourse == null)
                sourceCourse = CourseObjectMother.Create();

            if (demoCourse == null)
                demoCourse = CourseObjectMother.Create();

            return new DemoCourseInfo(sourceCourse, demoCourse, createdBy);
        }

        public static DemoCourseInfo CreateWithEmptySourceCourse(Course demoCourse = null, string createdBy = CreatedBy)
        {
            if (demoCourse == null)
                demoCourse = CourseObjectMother.Create();

            return new DemoCourseInfo(null, demoCourse, createdBy);
        }
    }
}
