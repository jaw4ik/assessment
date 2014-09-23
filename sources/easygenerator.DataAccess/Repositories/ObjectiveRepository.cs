using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.DataAccess.Repositories
{
    public class ObjectiveRepository : Repository<Objective>, IObjectiveRepository
    {
        public ObjectiveRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ICollection<Objective> GetAvailableObjectivesCollection(string username)
        {
            return _dataContext.GetSet<Objective>().Where(objective => objective.CreatedBy == username ||
                    objective.RelatedCoursesCollection.Any(course => course.CollaboratorsCollection.Any(
                        collaboration => collaboration.Email == username && !collaboration.Locked))
                    ).ToList();
        }
    }
}
