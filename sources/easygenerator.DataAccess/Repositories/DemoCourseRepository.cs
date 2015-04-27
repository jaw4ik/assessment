using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using System.Linq.Expressions;

namespace easygenerator.DataAccess.Repositories
{
    public class DemoCourseInfoRepository : Repository<DemoCourseInfo>, IDemoCourseInfoRepository
    {
        private IQueryable<DemoCourseInfo> DemoCourseInfos
        {
            get
            {
                return _dataContext.GetSet<DemoCourseInfo>()
                    .Include(demoCourseInfo => demoCourseInfo.DemoCourse)
                    .Include(demoCourseInfo => demoCourseInfo.SourceCourse);
            }
        }
        public DemoCourseInfoRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public new DemoCourseInfo Get(Guid id)
        {
            return DemoCourseInfos.SingleOrDefault(e => e.Id == id);
        }

        public new ICollection<DemoCourseInfo> GetCollection()
        {
            return DemoCourseInfos.ToList();
        }

        public new ICollection<DemoCourseInfo> GetCollection(Expression<Func<DemoCourseInfo, bool>> predicate)
        {
            return DemoCourseInfos.Where(predicate).ToList();
        }
    }
}
