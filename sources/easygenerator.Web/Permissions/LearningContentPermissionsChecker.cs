using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Permissions
{
    public class LearningContentPermissionsChecker : IEntityPermissionsChecker<LearningContent>
    {
        private IEntityPermissionsChecker<Question> _questionPermissionsChecker;

        public LearningContentPermissionsChecker(IEntityPermissionsChecker<Question> questionPermissionsChecker)
        {
            _questionPermissionsChecker = questionPermissionsChecker;
        }

        public bool HasCollaboratorPermissions(string username, LearningContent entity)
        {
            return entity.CreatedBy == username ||
                   _questionPermissionsChecker.HasCollaboratorPermissions(username, entity.Question);
        }
    }
}