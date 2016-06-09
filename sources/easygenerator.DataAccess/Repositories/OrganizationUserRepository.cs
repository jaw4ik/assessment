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

        public OrganizationInvite GetCollaborationInvite(OrganizationUser user)
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
    }
}
