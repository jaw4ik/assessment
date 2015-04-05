using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Clonning;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using System.Collections.Generic;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class QuestionController : DefaultController
    {
        private ICloner _cloner;
        private IEntityModelMapper<Question> _entityModelMapper;

        public QuestionController(ICloner cloner, IEntityModelMapper<Question> entityModelMapper)
        {
            _cloner = cloner;
            _entityModelMapper = entityModelMapper;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/updateTitle")]
        public ActionResult UpdateTitle(Question question, string title)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }


        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/updateContent")]
        public ActionResult UpdateContent(Question question, string content)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateContent(content, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/getQuestionFeedback")]
        public ActionResult GetQuestionFeedback(Question question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            return JsonSuccess(new
            {
                ModifiedOn = question.ModifiedOn,
                CorrectFeedbackText = question.Feedback.CorrectText,
                IncorrectFeedbackText = question.Feedback.IncorrectText
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/updateCorrectFeedback")]
        public ActionResult UpdateCorrectFeedback(Question question, string feedbackText)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateCorrectFeedbackText(feedbackText);

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/updateIncorrectFeedback")]
        public ActionResult UpdateIncorrectFeedback(Question question, string feedbackText)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateIncorrectFeedbackText(feedbackText);

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/question/delete")]
        public ActionResult Delete(Objective objective, ICollection<Question> questions)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            if (questions == null)
            {
                return BadRequest();
            }

            foreach (Question question in questions)
            {
                objective.RemoveQuestion(question, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/updateLearningContentsOrder")]
        public ActionResult UpdateLearningContentsOrder(Question question, ICollection<LearningContent> learningContents)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }

            question.UpdateLearningContentsOrder(learningContents, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [EntityCollaborator(typeof(Objective))]
        [QuestionAccess]
        [Route("api/question/copy")]
        public ActionResult Copy(Question question, Objective objective)
        {
            if (objective == null || question == null)
            {
                return BadRequest();
            }

            var questionCopy = _cloner.Clone(question, GetCurrentUsername());
            objective.AddQuestion(questionCopy, GetCurrentUsername());

            return JsonSuccess(_entityModelMapper.Map(questionCopy));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/question/move")]
        public ActionResult Move(Question question, Objective objective)
        {
            if (objective == null || question == null)
            {
                return BadRequest();
            }

            var sourceObjective = question.Objective;

            if (sourceObjective.Id != objective.Id)
            {
                sourceObjective.RemoveQuestion(question, GetCurrentUsername());
                objective.AddQuestion(question, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }
    }
}
