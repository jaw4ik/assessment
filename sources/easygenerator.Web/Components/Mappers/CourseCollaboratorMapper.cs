using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CourseCollaboratorMapper : IEntityMapper<CourseCollabrator>
    {
        public dynamic Map(CourseCollabrator collaborator)
        {
            return new
            {
                Id = collaborator.Id.ToNString(),
                Email = collaborator.User.Email,
                FullName = collaborator.User.FullName,
                CreatedOn = collaborator.CreatedOn
            };
        }
    }
}