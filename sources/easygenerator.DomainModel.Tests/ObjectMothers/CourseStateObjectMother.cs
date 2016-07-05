using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CourseStateObjectMother
    {
        public static CourseState Create(Course course, bool isDirty = false, bool isDirtyForSale = false)
        {
            return new CourseState(course, isDirty, isDirtyForSale);
        }

        public static CourseState Create()
        {
            return new CourseState(CourseObjectMother.Create(), false, false);
        }
    }
}
