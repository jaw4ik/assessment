using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CourseStateObjectMother
    {
        public static CourseState Create(Course course, bool hasUnpublishedChanges = false)
        {
            return new CourseState(course, hasUnpublishedChanges);
        }

        public static CourseState Create()
        {
            return new CourseState(CourseObjectMother.Create(), false);
        }
    }
}
