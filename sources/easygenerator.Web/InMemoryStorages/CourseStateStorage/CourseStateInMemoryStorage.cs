using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Concurrent;

namespace easygenerator.Web.InMemoryStorages.CourseStateStorage
{
    public class CourseStateInMemoryStorage : ICourseStateInMemoryStorage
    {
        private readonly ConcurrentDictionary<Guid, bool> _courseStates = new ConcurrentDictionary<Guid, bool>();

        public IEnumerable<bool> States
        {
            get { return _courseStates.Select(_ => _.Value); }
        }

        public CourseStateInMemoryStorage()
        {
            _courseStates = new ConcurrentDictionary<Guid, bool>();
        }

        public bool TryGetHasUnpublishedChanges(Course course, out bool value)
        {
            return _courseStates.TryGetValue(course.Id, out value);
        }

        public void SaveHasUnpublishedChanges(Course course, bool hasUnpublishedChanges)
        {
            _courseStates.AddOrUpdate(course.Id, hasUnpublishedChanges, (key, value) => hasUnpublishedChanges);
        }

        public void RemoveCourseState(Course course)
        {
            bool hasUnpublishedChanges;
            _courseStates.TryRemove(course.Id, out hasUnpublishedChanges);
        }
    }
}