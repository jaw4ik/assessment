using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.DomainModel.Entities.Questions;

namespace easygenerator.Web.Security.PermissionsCheckers
{
    public class HotSpotPolygonPermissionsChecker : EntityPermissionsChecker<HotSpotPolygon>
    {
        private readonly IEntityPermissionsChecker<Question> _questionPermissionsChecker;

        public HotSpotPolygonPermissionsChecker(IEntityPermissionsChecker<Question> questionPermissionsChecker)
        {
            _questionPermissionsChecker = questionPermissionsChecker;
        }

        public override bool HasCollaboratorPermissions(string username, HotSpotPolygon entity)
        {
            return _questionPermissionsChecker.HasCollaboratorPermissions(username, entity.Question);
        }
    }
}