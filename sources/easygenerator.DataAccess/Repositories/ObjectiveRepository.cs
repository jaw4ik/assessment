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
            IQueryable<User> users = _dataContext.GetSet<User>();
            DateTime currenTime = DateTimeWrapper.Now();

            return _dataContext.GetSet<Objective>().Where(objective => objective.CreatedBy == username
                    || objective.RelatedCoursesCollection.Any
                    (
                        course => course.CreatedBy == username ||
                            (
                                course.CollaboratorsCollection.Any(collaborator => collaborator.Email == username) &&
                                course.CollaboratorsCollection.Count <=
                                    (
                                        users.Where(user => user.Email == course.CreatedBy)
                                        .Select
                                        (
                                            user => (user.AccessType >= AccessType.Plus && !(!user.ExpirationDate.HasValue || user.ExpirationDate.Value < currenTime)) ? Int32.MaxValue :
                                                    ((user.AccessType >= AccessType.Starter && !(!user.ExpirationDate.HasValue || user.ExpirationDate.Value < currenTime)) ? Constants.Collaboration.MaxCollaboratorsCountForStarterPlan : 0)

                                        ).FirstOrDefault()
                                    )
                            )
                    )
                ).ToList();
        }
    }
}
