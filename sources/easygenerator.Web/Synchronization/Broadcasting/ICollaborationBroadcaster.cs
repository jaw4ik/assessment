using easygenerator.DomainModel.Entities;
using System.Collections.Generic;

namespace easygenerator.Web.Synchronization.Broadcasting
{
    public interface ICollaborationBroadcaster<T> : IBroadcaster
        where T : Entity
    {
        dynamic AllCollaborators(T entity);
        dynamic AllCollaboratorsExcept(T entity, params string[] excludeUsers);
        dynamic AllCollaboratorsExcept(T entity, List<string> excludeUsers);
        dynamic OtherCollaborators(T entity);
    }
}
