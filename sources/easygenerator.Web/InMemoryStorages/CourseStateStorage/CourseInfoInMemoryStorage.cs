using easygenerator.DomainModel.Entities;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.InMemoryStorages.CourseStateStorage
{
    public class CourseInfoInMemoryStorage : ICourseInfoInMemoryStorage
    {
        private readonly ConcurrentDictionary<Guid, CourseInfo> _infos = new ConcurrentDictionary<Guid, CourseInfo>();

        public IEnumerable<CourseInfo> CourseInfos
        {
            get { return _infos.Select(_ => _.Value); }
        }

        public CourseInfoInMemoryStorage()
        {
            _infos = new ConcurrentDictionary<Guid, CourseInfo>();
        }

        public CourseInfo GetCourseInfo(Course course)
        {
            CourseInfo info;
            return _infos.TryGetValue(course.Id, out info) ? info : new CourseInfo();
        }

        public void SaveCourseInfo(Course course, CourseInfo info)
        {
            _infos.AddOrUpdate(course.Id, info, (key, value) => info);
        }

        public void RemoveCourseInfo(Course course)
        {
            CourseInfo info;
            _infos.TryRemove(course.Id, out info);
        }
    }
}