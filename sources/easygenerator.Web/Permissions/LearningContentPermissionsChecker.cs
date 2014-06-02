using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Permissions
{
    public class LearningContentPermissionsChecker : IEntityPermissionsChecker<LearningContent>
    {
        private IEntityPermissionsChecker<Question> _questionPermissionsChecker;

        public LearningContentPermissionsChecker(IEntityPermissionsChecker<Question> questionPermissionsChecker)
        {
            _questionPermissionsChecker = questionPermissionsChecker;
        }

        public bool HasPermissions(string username, LearningContent entity)
        {
            return entity.CreatedBy == username ||
                   _questionPermissionsChecker.HasPermissions(username, entity.Question);
        }
    }
}