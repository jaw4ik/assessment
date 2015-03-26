using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public interface ICourseStateStorage
    {
        CourseState GetCourseState(Course course);
        void SaveCourseState(CourseState state);
        void RemoveCourseState(Course course);
    }
}