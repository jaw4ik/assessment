using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System;
using System.Linq;

namespace easygenerator.DataAccess.Repositories
{
    public class CourseStateRepository : Repository<CourseState>, ICourseStateRepository
    {
        public CourseStateRepository(IDataContext dataContext) : base(dataContext)
        {
        }

        public CourseState GetByCourseId(Guid courseId)
        {
            return _dataContext.GetSet<CourseState>().SingleOrDefault(e => e.Course.Id == courseId);
        }
    }
}
