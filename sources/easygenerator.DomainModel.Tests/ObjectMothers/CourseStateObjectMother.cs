using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CourseStateObjectMother
    {
        public static CourseState Create(Course course, CourseStateInfo info)
        {
            return new CourseState(course, info);
        }

        public static CourseState Create(Course course)
        {
            return new CourseState(course, CourseStateInfoObjectMother.Create());
        }

        public static CourseState Create()
        {
            return new CourseState(CourseObjectMother.Create(), CourseStateInfoObjectMother.Create());
        }
    }
}
