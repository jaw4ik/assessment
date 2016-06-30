using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CourseCollaboratorEntityModelMapper : EntityModelMapper<CourseCollaborator>
    {
        private readonly IUserRepository _userRepository;

        public CourseCollaboratorEntityModelMapper(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public override dynamic Map(CourseCollaborator collaborator)
        {
            var user = _userRepository.GetUserByEmail(collaborator.Email);

            return new
            {
                Id = collaborator.Id.ToNString(),
                Email = collaborator.Email,
                Registered = user != null,
                FullName = user?.FullName,
                CreatedOn = collaborator.CreatedOn,
                IsAccepted = collaborator.IsAccepted,
                IsAdmin = collaborator.IsAdmin
            };
        }
    }
}