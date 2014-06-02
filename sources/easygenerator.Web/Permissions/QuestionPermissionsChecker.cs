using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Permissions
{
    public class QuestionPermissionsChecker : IEntityPermissionsChecker<Question>
    {
        private IEntityPermissionsChecker<Objective> _objectivePermissionsChecker;

        public QuestionPermissionsChecker(IEntityPermissionsChecker<Objective> objectivePermissionsChecker)
        {
            _objectivePermissionsChecker = objectivePermissionsChecker;
        }

        public bool HasPermissions(string username, Question entity)
        {
            return entity.CreatedBy == username ||
                   _objectivePermissionsChecker.HasPermissions(username, entity.Objective);
        }
    }
}