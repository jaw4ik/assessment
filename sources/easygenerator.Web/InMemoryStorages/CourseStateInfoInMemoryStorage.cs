using easygenerator.DomainModel.Entities;
using easygenerator.Web.DomainEvents.ChangeTracking;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.InMemoryStorages
{
    public class CourseStateInfoInMemoryStorage : ICourseStateInfoInMemoryStorage
    {
        private readonly ConcurrentDictionary<Guid, CourseStateInfo> _courseStateInfos = new ConcurrentDictionary<Guid, CourseStateInfo>();

        public IEnumerable<CourseStateInfo> CourseStateInfos
        {
            get { return _courseStateInfos.Select(_ => _.Value); }
        }

        public CourseStateInfoInMemoryStorage()
        {
            _courseStateInfos = new ConcurrentDictionary<Guid, CourseStateInfo>();
        }

        public CourseStateInfo GetCourseStateInfo(Course course)
        {
            CourseStateInfo courseStateInfo;
            _courseStateInfos.TryGetValue(course.Id, out courseStateInfo);
            return courseStateInfo;
        }

        public void SaveCourseStateInfo(Course course, CourseStateInfo stateInfo)
        {
            _courseStateInfos.AddOrUpdate(course.Id, stateInfo, (key, value) => stateInfo);
        }

        public void RemoveCourseStateInfo(Course course)
        {
            CourseStateInfo courseStateInfo;
            _courseStateInfos.TryRemove(course.Id, out courseStateInfo);
        }
    }
}