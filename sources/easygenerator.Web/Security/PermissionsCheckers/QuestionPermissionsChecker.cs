using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public class QuestionPermissionsChecker : EntityPermissionsChecker<Question>
    {
        private readonly IEntityPermissionsChecker<Section> _sectionPermissionsChecker;

        public QuestionPermissionsChecker(IEntityPermissionsChecker<Section> sectionPermissionsChecker)
        {
            _sectionPermissionsChecker = sectionPermissionsChecker;
        }

        public override bool HasCollaboratorPermissions(string username, Question entity)
        {
            return _sectionPermissionsChecker.HasCollaboratorPermissions(username, entity.Section);
        }
    }
}