using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using System.Linq;

namespace easygenerator.Web.Components.ActionFilters.Permissions
{
    public class OrganizationAdminAttribute : EntityAccessAttribute
    {
        public OrganizationAdminAttribute() : base(typeof(Organization))
        {
        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            var organization = entity as Organization;
            return organization?.Users.FirstOrDefault(organizationUser => organizationUser.IsAdmin && organizationUser.Email == user.Email) != null;
        }
    }
}