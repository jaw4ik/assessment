using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
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
            const string query = @"
	            SELECT * FROM Objectives WHERE CreatedBy = @createdBy OR Id IN
	            (
		            SELECT co.Objective_Id FROM CourseObjectives co WHERE Course_Id IN
		            (
			            SELECT c.Id FROM Courses c WHERE c.CreatedBy = @createdBy
			            UNION
			            SELECT cc.Course_Id FROM CourseCollaborators cc	WHERE cc.Email = @createdBy AND cc.Locked = 0
		            )
	            )
            ";

            return ((DbSet<Objective>) _dataContext.GetSet<Objective>()).SqlQuery(query,
                new SqlParameter("@createdBy", username)).AsNoTracking().ToList();
        }
    }
}
