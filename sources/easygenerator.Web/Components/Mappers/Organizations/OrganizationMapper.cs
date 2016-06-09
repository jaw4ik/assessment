using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;
using System.Linq;

namespace easygenerator.Web.Components.Mappers.Organizations
{
    public class OrganizationMapper : IOrganizationMapper
    {
        private readonly IUserRepository _userRepository;

        public OrganizationMapper(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public dynamic Map(Organization organization, string userEmail)
        {
            return new
            {
                Id = organization.Id.ToNString(),
                Title = organization.Title,
                GrantsAdminAccess = organization.Users.SingleOrDefault(e => e.Email == userEmail && e.IsAdmin) != null
            };
        }
    }
}