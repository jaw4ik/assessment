using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;

namespace easygenerator.Web.Components.DomainOperations.OrganizationOperations
{
    public interface IOrganizationDomainOperationExecutor
    {
        void AutoincludeUserToOrganization(User user, Organization organization);
    }

    public class OrganizationDomainOperationExecutor : IOrganizationDomainOperationExecutor
    {
        private readonly AutoincludeUserToOrganizationOperation _autoincludeUserToOrganizationOperation;

        public OrganizationDomainOperationExecutor(AutoincludeUserToOrganizationOperation autoincludeUserToOrganizationOperation)
        {
            _autoincludeUserToOrganizationOperation = autoincludeUserToOrganizationOperation;
        }

        public void AutoincludeUserToOrganization(User user, Organization organization)
        {
            _autoincludeUserToOrganizationOperation.Execute(user, organization);
        }
    }
}