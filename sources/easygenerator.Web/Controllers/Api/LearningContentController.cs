﻿using System.Linq;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using easygenerator.Web.Components.ActionFilters.Permissions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class LearningContentController : DefaultApiController
    {
        private readonly IEntityFactory _entityFactory;

        public LearningContentController(IEntityFactory entityFactory)
        {
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/learningContent/create")]
        public ActionResult Create(Question question, string text, decimal position)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            var learningContent = _entityFactory.LearningContent(text, GetCurrentUsername(), position);

            question.AddLearningContent(learningContent, GetCurrentUsername());

            return JsonSuccess(new { Id = learningContent.Id.ToNString(), CreatedOn = learningContent.CreatedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/learningContent/delete")]
        public ActionResult Delete(Question question, LearningContent learningContent)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            if (learningContent != null)
            {
                question.RemoveLearningContent(learningContent, GetCurrentUsername());
            }

            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(LearningContent))]
        [Route("api/learningContent/updateText")]
        public ActionResult UpdateText(LearningContent learningContent, string text)
        {
            if (learningContent == null)
            {
                return JsonLocalizableError(Errors.LearningContentNotFoundError, Errors.LearningContentNotFoundResourceKey);
            }

            learningContent.UpdateText(text, GetCurrentUsername());

            return JsonSuccess(new { ModifiedOn = learningContent.ModifiedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(LearningContent))]
        [Route("api/learningContent/updatePosition")]
        public ActionResult UpdatePosition(LearningContent learningContent, decimal position)
        {
            if (learningContent == null)
            {
                return JsonLocalizableError(Errors.LearningContentNotFoundError, Errors.LearningContentNotFoundResourceKey);
            }

            learningContent.UpdatePosition(position, GetCurrentUsername());

            return JsonSuccess(new
            {
                ModifiedOn = learningContent.ModifiedOn
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/learningContents")]
        public ActionResult GetCollection(Question question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            var learningContents = question.LearningContents.Select(lo => new
            {
                Id = lo.Id.ToNString(),
                Text = lo.Text,
                Position = lo.Position,
                CreatedOn = lo.CreatedOn
            });

            return JsonSuccess(new { LearningContents = learningContents });
        }
    }
}