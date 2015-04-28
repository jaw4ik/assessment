using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public class SingleSelectImageAnswerPermissionChecker : EntityPermissionsChecker<SingleSelectImageAnswer>
    {
        private readonly IEntityPermissionsChecker<Question> _questionPermissionsChecker;

        public SingleSelectImageAnswerPermissionChecker(IEntityPermissionsChecker<Question> questionPermissionsChecker)
        {
            _questionPermissionsChecker = questionPermissionsChecker;
        }

        public override bool HasCollaboratorPermissions(string username, SingleSelectImageAnswer entity)
        {
            return _questionPermissionsChecker.HasCollaboratorPermissions(username, entity.Question);
        }
    }
}