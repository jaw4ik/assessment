using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.Web.InMemoryStorages
{
    public interface IDemoCoursesStorage
    {
        void Initialize();
        void AddDemoCourseInfo(DemoCourseInfo demoCourseInfo);
        void RemoveDemoCourseInfo(DemoCourseInfo demoCourseInfoId);
        void UpdateDemoCourseInfo(DemoCourseInfo demoCourseInfo);
        IEnumerable<DemoCourseInfo> DemoCoursesInfo { get; }
        IEnumerable<Course> DemoCourses { get; }
    }
}
