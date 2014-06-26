using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Permissions
{
    public class AnswerPermissionsChecker : EntityPermissionsChecker<Answer>
    {
        private readonly IEntityPermissionsChecker<Question> _questionPermissionsChecker;

        public AnswerPermissionsChecker(IEntityPermissionsChecker<Question> questionPermissionsChecker)
        {
            _questionPermissionsChecker = questionPermissionsChecker;
        }

        public override bool HasCollaboratorPermissions(string username, Answer entity)
        {
            return HasOwnerPermissions(username, entity) ||
                   _questionPermissionsChecker.HasCollaboratorPermissions(username, entity.Question);
        }
    }
}