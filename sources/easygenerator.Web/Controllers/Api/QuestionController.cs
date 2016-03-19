﻿using easygenerator.DomainModel.Entities;
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
    public class QuestionController : DefaultApiController
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
        [Route("api/question/updateVoiceOver")]
        public ActionResult UpdateVoiceOver(Question question, string voiceOver)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateVoiceOver(voiceOver, GetCurrentUsername());

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
        [EntityCollaborator(typeof(Section))]
        [Route("api/question/delete")]
        public ActionResult Delete(Section section, ICollection<Question> questions)
        {
            if (section == null)
            {
                return JsonLocalizableError(Errors.SectionNotFoundError, Errors.SectionNotFoundResourceKey);
            }

            if (questions == null)
            {
                return BadRequest();
            }

            foreach (Question question in questions)
            {
                section.RemoveQuestion(question, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = section.ModifiedOn });
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
        [EntityCollaborator(typeof(Section))]
        [QuestionAccess]
        [Route("api/question/copy")]
        public ActionResult Copy(Question question, Section section)
        {
            if (section == null || question == null)
            {
                return BadRequest();
            }

            var questionCopy = _cloner.Clone(question, GetCurrentUsername());
            section.AddQuestion(questionCopy, GetCurrentUsername());

            return JsonSuccess(_entityModelMapper.Map(questionCopy));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [EntityCollaborator(typeof(Section))]
        [Route("api/question/move")]
        public ActionResult Move(Question question, Section section)
        {
            if (section == null || question == null)
            {
                return BadRequest();
            }

            var sourceSection = question.Section;

            if (sourceSection.Id != section.Id)
            {
                sourceSection.RemoveQuestion(question, GetCurrentUsername());
                section.AddQuestion(question, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = section.ModifiedOn });
        }
    }
}
