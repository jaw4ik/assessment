using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Entities.Users;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.ActionFilters.Permissions;

namespace easygenerator.Web.Components.ActionFilters.Authorization
{
    public class QuestionAccessAttribute : EntityAccessAttribute
    {
        public QuestionAccessAttribute()
            :base(typeof(Question))
        {
            ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes;
        }

        protected override bool CheckEntityAccess(Entity entity, User user)
        {
            if (entity is DragAndDropText || entity is HotSpot || entity is Statement || entity is OpenQuestion)
            {
                return user.HasPlusAccess();
            }

            if (entity is FillInTheBlanks || entity is SingleSelectImage || entity is TextMatching)
            {
                return user.HasStarterAccess();
            }

            return true;
        }
    }
}