using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders
{
    public interface IEntityCollaboratorProvider<T>
        where T : Entity
    {
        IEnumerable<string> GetCollaborators(T entity);
        IEnumerable<string> GetUsersInvitedToCollaboration(T entity);
    }
}
