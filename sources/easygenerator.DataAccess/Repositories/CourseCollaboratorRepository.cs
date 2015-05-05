using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.DataAccess.Repositories
{
    public class CourseCollaboratorRepository : Repository<CourseCollaborator>, ICourseCollaboratorRepository
    {
        public CourseCollaboratorRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }

        public ICollection<Course> GetSharedCourses(string email)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(email, "email");
            return GetCollection(collaborator => collaborator.Email == email || collaborator.CreatedBy == email).Select(item => item.Course).ToList();
        }

        public void LockCollaboration(string email)
        {
            ((DatabaseContext)_dataContext).Database
                .ExecuteSqlCommand("UPDATE CourseCollaborators SET Locked = 1 WHERE CreatedBy = @createdBy", new SqlParameter("@createdBy", email));
        }

        public void UnlockCollaboration(string email, int allowedCollaborationsCount)
        {
            var command = @"UPDATE CourseCollaborators SET Locked = 0 WHERE Course_Id IN 
                            (
	                            SELECT Course_Id FROM CourseCollaborators WHERE CreatedBy = @createdBy
	                            GROUP BY Course_Id
	                            HAVING COUNT(*) <= @allowedCount
                            )";

            ((DatabaseContext)_dataContext).Database
                .ExecuteSqlCommand(command, new SqlParameter("@createdBy", email), new SqlParameter("@allowedCount", allowedCollaborationsCount));
        }


        public void UnlockCollaboration(string email)
        {
            ((DatabaseContext)_dataContext).Database
                .ExecuteSqlCommand("UPDATE CourseCollaborators SET Locked = 0 WHERE CreatedBy = @createdBy", new SqlParameter("@createdBy", email));
        }
    }
}
