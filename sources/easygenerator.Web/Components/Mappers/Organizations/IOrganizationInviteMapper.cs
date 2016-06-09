using easygenerator.Infrastructure.DomainModel.Mappings;

namespace easygenerator.Web.Components.Mappers.Organizations
{
    public interface IOrganizationInviteMapper
    {
        dynamic Map(OrganizationInvite invite);
    }
}