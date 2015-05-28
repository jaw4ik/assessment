using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public interface ICollaborationBroadcaster<T> : IBroadcaster
        where T : Entity
    {
        dynamic AllCollaborators(T entity);
        dynamic AllCollaboratorsExcept(T entity, params string[] excludeUsers);
        dynamic OtherCollaborators(T entity);
        dynamic UsersInvitedToCollaboration(T entity);
    }
}
