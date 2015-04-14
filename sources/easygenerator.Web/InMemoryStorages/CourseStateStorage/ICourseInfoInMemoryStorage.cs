using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.InMemoryStorages.CourseStateStorage
{
    public interface ICourseInfoInMemoryStorage
    {
        //DateTime BuildStartedOn(Course course);
        //void SetBuildStartedOn(Course course, DateTime buildStartedOn);

        //DateTime ChangedOn(Course course);
        //void SetChangedOn(Course course, DateTime changedOn);
        CourseInfo GetCourseInfo(Course course);
        void SaveCourseInfo(Course course, CourseInfo info);
        void RemoveCourseInfo(Course course);
    }
}
