using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Web.InMemoryStorages
{
    public class DemoCoursesInMemoryStorage : IDemoCoursesStorage
    {
        private readonly ConcurrentDictionary<Guid, DemoCourseInfo> _demoCoursesInfo = new ConcurrentDictionary<Guid, DemoCourseInfo>();
        private readonly IDemoCourseInfoRepository _demoCourseInfoRepository;

        public IEnumerable<DemoCourseInfo> DemoCoursesInfo
        {
            get { return _demoCoursesInfo.Select(_ => _.Value).OrderBy(_ => _.CreatedOn); }
        }

        public IEnumerable<Course> DemoCourses
        {
            get
            {
                return DemoCoursesInfo.Select(_ => _.DemoCourse);
            }
        }

        public DemoCoursesInMemoryStorage(IDemoCourseInfoRepository demoCourseInfoRepository)
        {
            _demoCoursesInfo = new ConcurrentDictionary<Guid, DemoCourseInfo>();
            _demoCourseInfoRepository = demoCourseInfoRepository;
        }

        public void Initialize()
        {
            var demoCourseInfos = _demoCourseInfoRepository.GetCollection().OrderBy(course => course.CreatedOn);
            foreach (var demoCourseInfo in demoCourseInfos)
            {
                _demoCoursesInfo.GetOrAdd(demoCourseInfo.Id, demoCourseInfo);
            }
        }

        public void AddDemoCourseInfo(DemoCourseInfo demoCourseInfo)
        {
            _demoCoursesInfo.TryAdd(demoCourseInfo.Id, demoCourseInfo);
        }

        public void RemoveDemoCourseInfo(DemoCourseInfo demoCourseInfo)
        {
            DemoCourseInfo courseInfo;
            _demoCoursesInfo.TryRemove(demoCourseInfo.Id, out courseInfo);
        }

        public void UpdateDemoCourseInfo(DemoCourseInfo demoCourseInfo)
        {
            DemoCourseInfo courseInfo;
            if (_demoCoursesInfo.TryGetValue(demoCourseInfo.Id, out courseInfo))
            {
                _demoCoursesInfo.TryUpdate(demoCourseInfo.Id, demoCourseInfo, courseInfo);
            }
        }
    }
}