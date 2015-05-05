using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.DomainModel.Mappings;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;

namespace easygenerator.DataAccess.Repositories
{
    public class CourseCollaboratorRepository : Repository<CourseCollaborator>, ICourseCollaboratorRepository
    {
        private Database Database
        {
            get { return ((DatabaseContext)_dataContext).Database; }
        }

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
            Database.ExecuteSqlCommand("UPDATE CourseCollaborators SET Locked = 1 WHERE CreatedBy = @createdBy", new SqlParameter("@createdBy", email));
        }

        public void UnlockCollaboration(string email, int allowedCollaborationsCount)
        {
            var command = @"UPDATE CourseCollaborators SET Locked = 0 WHERE Course_Id IN 
                            (
	                            SELECT Course_Id FROM CourseCollaborators WHERE CreatedBy = @createdBy
	                            GROUP BY Course_Id
	                            HAVING COUNT(*) <= @allowedCount
                            )";

            Database.ExecuteSqlCommand(command, new SqlParameter("@createdBy", email), new SqlParameter("@allowedCount", allowedCollaborationsCount));
        }


        public void UnlockCollaboration(string email)
        {
            Database.ExecuteSqlCommand("UPDATE CourseCollaborators SET Locked = 0 WHERE CreatedBy = @createdBy", new SqlParameter("@createdBy", email));
        }

        public IEnumerable<CollaborationInvite> GetCollaborationInvites(string userEmail)
        {
            const string query = @"
				SELECT collaborator.Id, 
                       author.FirstName as CourseAuthorFirstName, 
                       author.LastName as CourseAuthorLastName, 
                       course.Title as CourseTitle,
                       course.Id as CourseId
                FROM CourseCollaborators collaborator
                      INNER JOIN Users author ON author.Email = collaborator.CreatedBy
                      INNER JOIN Courses course ON course.Id = collaborator.Course_Id
                WHERE collaborator.Locked = 0 AND collaborator.IsAccepted = 0 AND collaborator.Email = @userEmail
			";

            return Database.SqlQuery<CollaborationInvite>(query,
                new SqlParameter("@userEmail", userEmail)).ToList();
        }

        public CollaborationInvite GetCollaborationInvite(CourseCollaborator collaborator)
        {
            const string query = @"
				SELECT collaborator.Id, 
                       author.FirstName as CourseAuthorFirstName, 
                       author.LastName as CourseAuthorLastName, 
                       course.Title as CourseTitle,
                       course.Id as CourseId
                FROM CourseCollaborators collaborator
                      INNER JOIN Users author ON author.Email = collaborator.CreatedBy
                      INNER JOIN Courses course ON course.Id = collaborator.Course_Id
                WHERE collaborator.Locked = 0 AND collaborator.IsAccepted = 0 AND collaborator.Id = @id
			";

            return Database.SqlQuery<CollaborationInvite>(query,
                new SqlParameter("@id", collaborator.Id)).FirstOrDefault();
        }
    }
}
