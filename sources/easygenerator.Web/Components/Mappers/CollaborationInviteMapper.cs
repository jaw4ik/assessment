using easygenerator.Infrastructure.DomainModel.Mappings;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public interface ICollaborationInviteMapper
    {
        dynamic Map(CollaborationInvite invite);
    }

    public class CollaborationInviteMapper : ICollaborationInviteMapper
    {
        public dynamic Map(CollaborationInvite invite)
        {
            return new
            {
                Id = invite.Id.ToNString(),
                CourseId = invite.CourseId.ToNString(),
                CourseAuthorFirstName = invite.CourseAuthorFirstName,
                CourseAuthorLastName = invite.CourseAuthorLastName,
                CourseTitle = invite.CourseTitle
            };
        }
    }
}