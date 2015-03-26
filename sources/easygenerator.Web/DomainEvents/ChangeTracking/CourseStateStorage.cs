using easygenerator.DomainModel.Entities;
using easygenerator.Web.InMemoryStorages;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public class CourseStateStorage : ICourseStateStorage
    {
        private readonly ICourseStateInMemoryStorage _courseStateInMemoryStorage;

        public CourseStateStorage(ICourseStateInMemoryStorage courseStateInMemoryStorage)
        {
            _courseStateInMemoryStorage = courseStateInMemoryStorage;
        }

        public CourseState GetCourseState(Course course)
        {
            var state = _courseStateInMemoryStorage.GetCourseState(course);
            return state ?? new CourseState(course);
        }

        public void SaveCourseState(CourseState state)
        {
            _courseStateInMemoryStorage.SaveCourseState(state);
        }

        public void RemoveCourseState(Course course)
        {
            _courseStateInMemoryStorage.RemoveCourseState(course);
        }
    }
}