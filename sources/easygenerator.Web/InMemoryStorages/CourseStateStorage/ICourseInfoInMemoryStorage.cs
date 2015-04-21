using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.InMemoryStorages.CourseStateStorage
{
    public interface ICourseInfoInMemoryStorage
    {
        CourseInfo GetCourseInfoOrDefault(Course course);
        CourseInfo GetCourseInfo(Course course);
        void SaveCourseInfo(Course course, CourseInfo info);
        void RemoveCourseInfo(Course course);
    }
}
