using easygenerator.DomainModel.Entities;
using easygenerator.Web.DomainEvents.ChangeTracking;

namespace easygenerator.Web.InMemoryStorages
{
    public interface ICourseStateInfoInMemoryStorage
    {
        CourseStateInfo GetCourseStateInfo(Course course);
        void SaveCourseStateInfo(Course course, CourseStateInfo stateInfo);
        void RemoveCourseStateInfo(Course course);
    }
}
