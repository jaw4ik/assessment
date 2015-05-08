using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public class TextMatchingAnswerPermissionsChecker: EntityPermissionsChecker<TextMatchingAnswer>
    {
        private readonly IEntityPermissionsChecker<Question> _questionPermissionsChecker;

        public TextMatchingAnswerPermissionsChecker(IEntityPermissionsChecker<Question> questionPermissionsChecker)
        {
            _questionPermissionsChecker = questionPermissionsChecker;
        }

        public override bool HasCollaboratorPermissions(string username, TextMatchingAnswer entity)
        {
            return _questionPermissionsChecker.HasCollaboratorPermissions(username, entity.Question);
        }
    }
}