using easygenerator.DomainModel.Entities;
using System.Linq;

namespace easygenerator.Web.Permissions
{
    public class ObjectivePermissionChecker : IEntityPermissionChecker<Objective>
    {
        public bool HasPermissions(string username, Objective objective)
        {
            return objective.CreatedBy == username ||
                   objective.Courses.Any(e => e.Collaborators.Any(c => c.Email == username));
        }
    }
}