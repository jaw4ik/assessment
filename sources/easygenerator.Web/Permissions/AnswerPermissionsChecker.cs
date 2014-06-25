using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Permissions
{
    public class AnswerPermissionsChecker : IEntityPermissionsChecker<Answer>
    {
        private IEntityPermissionsChecker<Question> _questionPermissionsChecker;

        public AnswerPermissionsChecker(IEntityPermissionsChecker<Question> questionPermissionsChecker)
        {
            _questionPermissionsChecker = questionPermissionsChecker;
        }

        public bool HasCollaboratorPermissions(string username, Answer entity)
        {
            return entity.CreatedBy == username ||
                   _questionPermissionsChecker.HasCollaboratorPermissions(username, entity.Question);
        }
    }
}