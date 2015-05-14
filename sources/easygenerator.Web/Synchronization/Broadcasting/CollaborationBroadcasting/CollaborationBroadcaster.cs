using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting.CollaboratorProviders;
using System.Collections.Generic;

namespace easygenerator.Web.Synchronization.Broadcasting.CollaborationBroadcasting
{
    public class CollaborationBroadcaster<T> : Broadcaster, ICollaborationBroadcaster<T>
        where T : Entity
    {
        private readonly IEntityCollaboratorProvider<T> _collaboratorProvider;

        public CollaborationBroadcaster(IEntityCollaboratorProvider<T> collaboratorProvider)
        {
            _collaboratorProvider = collaboratorProvider;
        }

        public dynamic AllCollaborators(T entity)
        {
            ThrowIfEntityNotValid(entity);

            return Users(GetCollaborators(entity));
        }

        public dynamic AllCollaboratorsExcept(T entity, params string[] excludeUsers)
        {
            ThrowIfEntityNotValid(entity);

            return UsersExcept(GetCollaborators(entity), excludeUsers);
        }

        public dynamic OtherCollaborators(T entity)
        {
            ThrowIfEntityNotValid(entity);

            return UsersExcept(GetCollaborators(entity), CurrentUsername);
        }

        private IEnumerable<string> GetCollaborators(T entity)
        {
            return _collaboratorProvider.GetCollaborators(entity);
        }

        private void ThrowIfEntityNotValid(T entity)
        {
            ArgumentValidation.ThrowIfNull(entity, "entity");
        }
    }
}