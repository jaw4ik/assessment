using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.InMemoryStorages.CourseStateStorage
{
    public interface ICourseInfoInMemoryStorage
    {
        CourseInfo GetCourseInfo(Course course);
        CourseInfo GetCourseInfo(Course course, out bool containsInfo);
        void SaveCourseInfo(Course course, CourseInfo info);
        void RemoveCourseInfo(Course course);
    }
}
