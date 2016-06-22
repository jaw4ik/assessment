using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.OrganizationBroadcasting
{
    public class OrganizationUserBroadcaster : Broadcaster, IOrganizationUserBroadcaster
    {
        private readonly IOrganizationRepository _organizationRepository;

        public OrganizationUserBroadcaster(IOrganizationRepository organizationRepository)
        {
            _organizationRepository = organizationRepository;
        }

        public dynamic OrganizationAdmins(string userEmail)
        {
            var admins = GetAdmins(_organizationRepository.GetAllOrganizations(userEmail));

            return UsersExcept(admins, userEmail);
        }

        private IEnumerable<string> GetAdmins(IEnumerable<Organization> organizations)
        {
            var admins = new List<string>();

            foreach (var organization in organizations)
            {
                var users = organization.Users.Where(u => u.Status == OrganizationUserStatus.Accepted && u.IsAdmin).Select(u => u.Email).ToList();
                admins.AddRange(users);
            }

            return admins.Distinct();
        }
    }
}