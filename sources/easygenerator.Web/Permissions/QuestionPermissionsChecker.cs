using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Permissions
{
    public class QuestionPermissionsChecker : EntityPermissionsChecker<Question>
    {
        private readonly IEntityPermissionsChecker<Objective> _objectivePermissionsChecker;

        public QuestionPermissionsChecker(IEntityPermissionsChecker<Objective> objectivePermissionsChecker)
        {
            _objectivePermissionsChecker = objectivePermissionsChecker;
        }

        public override bool HasCollaboratorPermissions(string username, Question entity)
        {
            return HasOwnerPermissions(username, entity) ||
                   _objectivePermissionsChecker.HasCollaboratorPermissions(username, entity.Objective);
        }
    }
}