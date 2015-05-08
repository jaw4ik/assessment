using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;
using easygenerator.Web.ViewModels.Api;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    public class FillInTheBlanksController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;

        public FillInTheBlanksController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost, StarterAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/question/" + Question.QuestionTypes.FillInTheBlanks + "/create")]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.FillInTheBlanksQuestion(title, GetCurrentUsername());

            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/fillintheblank/update")]
        public ActionResult Update(FillInTheBlanks question, string fillInTheBlank, ICollection<BlankAnswerViewModel> answersCollection)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }

            var answers = new Collection<BlankAnswer>();

            if (answersCollection != null)
            {
                foreach (var answerViewModel in answersCollection)
                {
                    var answer = _entityFactory.BlankAnswer(answerViewModel.Text, answerViewModel.IsCorrect,
                                answerViewModel.GroupId, GetCurrentUsername());
                    answers.Add(answer);
                }
            }

            question.UpdateAnswers(answers, GetCurrentUsername());
            question.UpdateContent(fillInTheBlank, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/fillintheblank")]
        public ActionResult Get(FillInTheBlanks question)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }

            return JsonSuccess(new
            {
                content = question.Content,

                answers = question.Answers.Select(answer => new
                {
                    id = answer.Id.ToNString(),
                    text = answer.Text,
                    isCorrect = answer.IsCorrect,
                    groupId = answer.GroupId.ToNString()
                })
            });
        }

    }

}