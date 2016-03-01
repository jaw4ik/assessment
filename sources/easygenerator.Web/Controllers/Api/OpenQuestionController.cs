using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    public class OpenQuestionController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public OpenQuestionController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Section))]
        [PlusAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [Route("api/question/" + Question.QuestionTypes.OpenQuestion + "/create")]
        public ActionResult Create(Section section, string title)
        {
            if (section == null)
            {
                return JsonLocalizableError(Errors.SectionNotFoundError, Errors.SectionNotFoundResourceKey);
            }

            var question = _entityFactory.OpenQuestion(title, GetCurrentUsername());

            section.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }
    }
}