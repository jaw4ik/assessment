using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public interface ICourseStateInfoStorage
    {
        CourseStateInfo GetCourseStateInfo(Course course);
        void SaveCourseStateInfo(Course course, CourseStateInfo stateInfo);
        void RemoveCourseStateInfo(Course course);
    }
}