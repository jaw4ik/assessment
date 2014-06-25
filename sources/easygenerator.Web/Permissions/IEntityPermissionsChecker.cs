using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Permissions
{
    public interface IEntityPermissionsChecker<T> where T : Entity
    {
        bool HasCollaboratorPermissions(string username, T entity);
    }
}
