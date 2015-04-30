using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class CollaborationInviteMapper
    {
        public dynamic Map(CourseCollaborator collaborator)
        {
            return new
            {
                Id = collaborator.Id.ToNString()
            };
        }
    }
}