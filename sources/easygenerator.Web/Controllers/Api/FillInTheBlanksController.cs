using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;
using easygenerator.Web.ViewModels.Api;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    public class FillInTheBlanksController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IDomainEventPublisher _eventPublisher;

        public FillInTheBlanksController(IEntityFactory entityFactory, IDomainEventPublisher eventPublisher)
        {
            _entityFactory = entityFactory;
            _eventPublisher = eventPublisher;
        }

        [HttpPost, StarterAccess(ErrorMessageResourceKey = Errors.UpgradeToStarterPlanToCreateOtherQuestionTypes)]
        [EntityPermissions(typeof(Objective))]
        [Route("api/question/create/type/1")]
        public ActionResult CreateFillInTheBlank(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.FillInTheBlanksQuestion(title, GetCurrentUsername());

            objective.AddQuestion(question, GetCurrentUsername());
            _eventPublisher.Publish(new QuestionCreatedEvent(question));

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        [EntityPermissions(typeof(Question))]
        [Route("api/question/updatefillintheblank")]
        public ActionResult UpdateFillInTheBlank(FillInTheBlanks question, string fillInTheBlank, ICollection<AnswerViewModel> answersCollection)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }

            var answers = new Collection<Answer>();

            if (answersCollection != null)
            {
                foreach (var answerViewModel in answersCollection)
                {
                    var answer = _entityFactory.Answer(answerViewModel.Text, answerViewModel.IsCorrect,
                                answerViewModel.GroupId, GetCurrentUsername());
                    answers.Add(answer);
                }
            }

            question.UpdateAnswers(answers, GetCurrentUsername());

            question.UpdateContent(fillInTheBlank, GetCurrentUsername());

			_eventPublisher.Publish(new FillInTheBlankUpdatedEvent(question, answers));
			
            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

    }

}