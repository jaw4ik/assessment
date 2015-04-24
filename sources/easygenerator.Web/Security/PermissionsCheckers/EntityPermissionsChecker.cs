using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public abstract class EntityPermissionsChecker<T> : IEntityPermissionsChecker<T>
        where T : Entity
    {
        public bool HasOwnerPermissions(string username, T entity)
        {
            return entity.CreatedBy == username;
        }

        public abstract bool HasCollaboratorPermissions(string username, T entity);
    }
}