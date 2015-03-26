using easygenerator.DomainModel.Entities;
using easygenerator.Web.DomainEvents.ChangeTracking;
using System;
using System.Collections.Concurrent;

namespace easygenerator.Web.InMemoryStorages
{
    public class CourseStateInMemoryStorage : ICourseStateInMemoryStorage
    {
        private readonly ConcurrentDictionary<Guid, CourseState> _courseStates = new ConcurrentDictionary<Guid, CourseState>();

        public CourseStateInMemoryStorage()
        {
            _courseStates = new ConcurrentDictionary<Guid, CourseState>();
        }

        public void SaveCourseState(CourseState state)
        {
            _courseStates.AddOrUpdate(state.Course.Id, state, (key, value) => state);
        }

        public void RemoveCourseState(Course course)
        {
            CourseState courseState;
            _courseStates.TryRemove(course.Id, out courseState);
        }

        public CourseState GetCourseState(Course course)
        {
            CourseState courseState;
            _courseStates.TryGetValue(course.Id, out courseState);
            return courseState;
        }
    }
}