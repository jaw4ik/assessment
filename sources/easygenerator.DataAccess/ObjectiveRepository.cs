using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess
{
    public class ObjectiveRepository : IRepository<Objective>, IObjectiveRepository
    {
        private readonly IDataContext _dataContext;

        public ObjectiveRepository(IDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public Objective Get(Guid id)
        {
            return _dataContext.Objectives.SingleOrDefault(objective => objective.Id == id);
        }

        public ICollection<Objective> GetCollection()
        {
            return _dataContext.Objectives;
        }

        public void Add(Objective entity)
        {
            _dataContext.Objectives.Add(entity);
        }

        public void Remove(Objective entity)
        {
            _dataContext.Objectives.Remove(entity);
        }
    }
}
