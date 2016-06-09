using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers.Organizations
{
    public class OrganizationUserMapper : IEntityModelMapper<OrganizationUser>
    {
        private readonly IUserRepository _userRepository;

        public OrganizationUserMapper(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public dynamic Map(OrganizationUser organizationUser)
        {
            var user = _userRepository.GetUserByEmail(organizationUser.Email);

            return new
            {
                Id = organizationUser.Id.ToNString(),
                Email = organizationUser.Email,
                IsRegistered = user != null,
                FullName = user?.FullName,
                CreatedOn = organizationUser.CreatedOn,
                Status = organizationUser.Status,
                IsAdmin = organizationUser.IsAdmin
            };
        }
    }
}