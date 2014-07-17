using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Permissions;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class QuestionController : DefaultController
    {
        private readonly IDomainEventPublisher _eventPublisher;

        public QuestionController(IDomainEventPublisher eventPublisher)
        {
            _eventPublisher = eventPublisher;
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
            _eventPublisher.Publish(new QuestionTitleUpdatedEvent(question));

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
            _eventPublisher.Publish(new QuestionContentUpdatedEvent(question));

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
            _eventPublisher.Publish(new QuestionCorrectFeedbackUpdatedEvent(question));

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
            _eventPublisher.Publish(new QuestionIncorrectFeedbackUpdatedEvent(question));

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

            _eventPublisher.Publish(new QuestionsDeletedEvent(objective, questions));
            return JsonSuccess(new { ModifiedOn = objective.ModifiedOn });
        }

    }
}
