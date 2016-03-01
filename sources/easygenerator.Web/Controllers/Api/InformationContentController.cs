using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    public class InformationContentController : DefaultApiController
    {
        private readonly IEntityFactory _entityFactory;

        public InformationContentController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Section))]
        [Route("api/question/" + Question.QuestionTypes.InformationContent + "/create")]
        public ActionResult Create(Section section, string title)
        {
            if (section == null)
            {
                return JsonLocalizableError(Errors.SectionNotFoundError, Errors.SectionNotFoundResourceKey);
            }

            var question = _entityFactory.InformationContent(title, GetCurrentUsername());

            section.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }
    }
}