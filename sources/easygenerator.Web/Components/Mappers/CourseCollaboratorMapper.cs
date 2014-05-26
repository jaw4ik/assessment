using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CourseCollaboratorMapper : IEntityMapper<CourseCollaborator>
    {
        private readonly IUserRepository _userRepository;

        public CourseCollaboratorMapper(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public dynamic Map(CourseCollaborator collaborator)
        {
            var user = _userRepository.GetUserByEmail(collaborator.Email);

            return new
            {
                Id = collaborator.Id.ToNString(),
                Email = collaborator.Email,
                FullName = user == null ? null : user.FullName,
                CreatedOn = collaborator.CreatedOn
            };
        }
    }
}