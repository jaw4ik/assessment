using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public class LearningContentPermissionsChecker : EntityPermissionsChecker<LearningContent>
    {
        private readonly IEntityPermissionsChecker<Question> _questionPermissionsChecker;

        public LearningContentPermissionsChecker(IEntityPermissionsChecker<Question> questionPermissionsChecker)
        {
            _questionPermissionsChecker = questionPermissionsChecker;
        }

        public override bool HasCollaboratorPermissions(string username, LearningContent entity)
        {
            return _questionPermissionsChecker.HasCollaboratorPermissions(username, entity.Question);
        }
    }
}