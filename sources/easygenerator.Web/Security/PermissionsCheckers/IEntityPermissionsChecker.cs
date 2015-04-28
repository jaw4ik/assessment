using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public interface IEntityPermissionsChecker<T> where T : Entity
    {
        bool HasOwnerPermissions(string username, T entity);
        bool HasCollaboratorPermissions(string username, T entity);
    }
}
