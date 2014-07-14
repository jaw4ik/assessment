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
                || objective.RelatedCoursesCollection.Join(users, course => course.CreatedBy, user => user.Email, (course, user) => new { course, user }).Any
                (
                    courseUsers => courseUsers.course.CreatedBy == username ||
                        (
                            courseUsers.course.CollaboratorsCollection.Any(collaborator => collaborator.Email == username) &&
                            courseUsers.course.CollaboratorsCollection.Count <=
                                (

                                     (courseUsers.user.AccessType >= AccessType.Plus && !(!courseUsers.user.ExpirationDate.HasValue || courseUsers.user.ExpirationDate.Value < currenTime)) ? Int32.MaxValue :
                                         ((courseUsers.user.AccessType >= AccessType.Starter && !(!courseUsers.user.ExpirationDate.HasValue || courseUsers.user.ExpirationDate.Value < currenTime)) ? Constants.Collaboration.MaxCollaboratorsCountForStarterPlan : 0)

                                )
                        )
                )
            ).ToList();
        }
    }
}
