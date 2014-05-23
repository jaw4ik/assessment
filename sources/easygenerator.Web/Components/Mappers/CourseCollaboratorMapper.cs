using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Components.Mappers
{
    public class CourseCollaboratorMapper : IEntityMapper<CourseCollabrator>
    {
        public dynamic Map(CourseCollabrator collaborator)
        {
            return new
            {
                Email = collaborator.User.Email,
                FullName = collaborator.User.FullName
            };
        }
    }
}