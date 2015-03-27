using easygenerator.DomainModel.Entities;
using easygenerator.Web.InMemoryStorages;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public class CourseStateInfoStorage : ICourseStateInfoStorage
    {
        private readonly ICourseStateInfoInMemoryStorage _inMemoryStorage;

        public CourseStateInfoStorage(ICourseStateInfoInMemoryStorage inMemoryStorage)
        {
            _inMemoryStorage = inMemoryStorage;
        }

        public CourseStateInfo GetCourseStateInfo(Course course)
        {
            var stateInfo = _inMemoryStorage.GetCourseStateInfo(course);
            return stateInfo ?? new CourseStateInfo();
        }

        public void SaveCourseStateInfo(Course course, CourseStateInfo stateInfo)
        {
            _inMemoryStorage.SaveCourseStateInfo(course, stateInfo);
        }

        public void RemoveCourseStateInfo(Course course)
        {
            _inMemoryStorage.RemoveCourseStateInfo(course);
        }
    }
}