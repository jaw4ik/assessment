using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure.DomainModel.Mappings;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;

namespace easygenerator.DataAccess.Repositories
{
    public class OrganizationUserRepository : Repository<OrganizationUser>, IOrganizationUserRepository
    {
        private Database Database
        {
            get { return ((DatabaseContext)_dataContext).Database; }
        }

        public OrganizationUserRepository(IDataContext dataContext) : base(dataContext)
        {
        }

        public OrganizationInvite GetOrganizationInvite(OrganizationUser user)
        {
            var query = @"
                SELECT organizationUser.Id, 
                       admin.FirstName as OrganizationAdminFirstName, 
                       admin.LastName as OrganizationAdminLastName, 
                       organization.Title as OrganizationTitle,
                       organization.Id as OrganizationId
                FROM OrganizationUsers organizationUser
                      INNER JOIN Users admin ON admin.Email = organizationUser.CreatedBy
                      INNER JOIN Organizations organization ON organization.Id = organizationUser.Organization_Id
                WHERE organizationUser.Status = 0 AND organizationUser.Id = @id
            ";
            return Database.SqlQuery<OrganizationInvite>(query,
                new SqlParameter("@id", user.Id)).FirstOrDefault();
        }

        public IEnumerable<OrganizationInvite> GetOrganizationInvites(string email)
        {
            var query = @"
                SELECT organizationUser.Id, 
                       admin.FirstName as OrganizationAdminFirstName, 
                       admin.LastName as OrganizationAdminLastName, 
                       organization.Title as OrganizationTitle,
                       organization.Id as OrganizationId
                FROM OrganizationUsers organizationUser
                      INNER JOIN Users admin ON admin.Email = organizationUser.CreatedBy
                      INNER JOIN Organizations organization ON organization.Id = organizationUser.Organization_Id
                WHERE organizationUser.Status = 0 AND organizationUser.Email = @userEmail
            ";

            return Database.SqlQuery<OrganizationInvite>(query,
                new SqlParameter("@userEmail", email)).ToList();
        }

        public IEnumerable<string> GetUserOrganizationAdminEmails(string organizationUserEmail)
        {
            var query = @"SELECT u.Email FROM OrganizationUsers u 
				WHERE u.Status = @status and IsAdmin = 1 and Organization_Id IN 
				(
					SELECT Organization_Id from OrganizationUsers where Email = @userEmail and Status = @status
				)";

            return Database.SqlQuery<string>(query,
                new SqlParameter("@userEmail", organizationUserEmail),
                new SqlParameter("@status", OrganizationUserStatus.Accepted)).ToList();
        }

        public IEnumerable<User> GetUserOrganizationAdminUsers(string organizationUserEmail)
        {
            var query = @"SELECT u.* FROM Users u INNER JOIN OrganizationUsers organizationUser ON u.Email = organizationUser.Email
				WHERE organizationUser.Status = @status and organizationUser.IsAdmin = 1 and Organization_Id IN 
				(
					SELECT Organization_Id from OrganizationUsers where Email = @userEmail and Status = @status
				)";

            return Database.SqlQuery<User>(query,
                new SqlParameter("@userEmail", organizationUserEmail),
                new SqlParameter("@status", OrganizationUserStatus.Accepted)).ToList();
        }

        public bool HasMultipleOrganizationAdminRelations(string userEmail, string adminEmail)
        {
            var query = @"SELECT COUNT(u.Id) FROM OrganizationUsers u 
				WHERE u.Email = @adminEmail and u.Status = @status and u.IsAdmin = 1 and Organization_Id IN 
				(
					SELECT Organization_Id from OrganizationUsers where Email = @userEmail and Status = @status
				)";

            var count = Database.SqlQuery<int>(query,
                new SqlParameter("@userEmail", userEmail),
                new SqlParameter("@adminEmail", adminEmail),
                new SqlParameter("@status", OrganizationUserStatus.Accepted)).FirstOrDefault();

            return count > 1;
        }
    }
}