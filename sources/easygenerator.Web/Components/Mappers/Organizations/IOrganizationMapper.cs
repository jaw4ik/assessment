using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.Web.Components.Mappers.Organizations
{
    public interface IOrganizationMapper
    {
        dynamic Map(Organization organization, string userEmail);
    }
}
