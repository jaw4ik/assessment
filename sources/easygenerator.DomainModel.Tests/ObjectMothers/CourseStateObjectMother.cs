using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Tests.ObjectMothers
{
    public class CourseStateObjectMother
    {
        public static CourseState Create(Course course = null, bool hasUnpublishedChanges = false)
        {
            if (course == null)
                course = CourseObjectMother.Create();

            return new CourseState(course, hasUnpublishedChanges);
        }

    }
}
