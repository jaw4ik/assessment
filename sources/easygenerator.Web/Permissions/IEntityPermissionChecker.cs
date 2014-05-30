using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Permissions
{
    public interface IEntityPermissionChecker<T> where T : Entity
    {
        bool HasPermissions(string username, T entity);
    }
}
