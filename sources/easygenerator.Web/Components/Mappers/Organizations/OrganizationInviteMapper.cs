using easygenerator.Infrastructure.DomainModel.Mappings;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers.Organizations
{
    public class OrganizationInviteMapper : IOrganizationInviteMapper
    {
        public dynamic Map(OrganizationInvite invite)
        {
            return new
            {
                Id = invite.Id.ToNString(),
                OrganizationId = invite.OrganizationId.ToNString(),
                OrganizationAdminFirstName = invite.OrganizationAdminFirstName,
                OrganizationAdminLastName = invite.OrganizationAdminLastName,
                OrganizationTitle = invite.OrganizationTitle
            };
        }
    }
}