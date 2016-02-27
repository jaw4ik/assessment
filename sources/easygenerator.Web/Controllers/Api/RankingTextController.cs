using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Extensions;
using easygenerator.Web.ViewModels.Api;

namespace easygenerator.Web.Controllers.Api
{
    public class RankingTextController: DefaultApiController
    {
        private readonly IEntityMapper _entityMapper;
        private readonly IEntityFactory _entityFactory;

        public RankingTextController(IEntityFactory entityFactory, IEntityMapper entityMapper)
        {
            _entityFactory = entityFactory;
            _entityMapper = entityMapper;
        }

        [HttpPost, AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [EntityCollaborator(typeof(Objective))]
        [Route("api/question/rankingText/create")]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var firstAnswer  = _entityFactory.RankingTextAnswer("", GetCurrentUsername());
            var secondAnswer = _entityFactory.RankingTextAnswer("", GetCurrentUsername(), DateTimeWrapper.Now().AddSeconds(1));

            var question = _entityFactory.RankingTextQuestion(title, GetCurrentUsername(), firstAnswer, secondAnswer);
            
            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/rankingText/answers/updateOrder")]
        public ActionResult UpdateOrder(RankingText question, ICollection<RankingTextAnswer> answers)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }

            question.UpdateAnswersOrder(answers, GetCurrentUsername());
            
            return JsonSuccess(new { ModifiedOn = question.ModifiedOn });
        }
        
        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/rankingText/answers")]
        public ActionResult GetAnswers(RankingText question)
        {
            var answers = question.Answers.Select(answer => _entityMapper.Map(answer));
            return JsonSuccess(new { answers = answers });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/rankingText/answer/add")]
        public ActionResult AddAnswer(RankingText question)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }

            var answer = _entityFactory.RankingTextAnswer("", GetCurrentUsername());
            question.AddAnswer(answer, GetCurrentUsername());

            return JsonSuccess(_entityMapper.Map(answer));
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/rankingText/answer/delete")]
        public ActionResult DeleteAnswer(RankingText question, RankingTextAnswer answer)
        {
            if (question == null)
            {
                return HttpNotFound(Errors.QuestionNotFoundError);
            }

            if (answer == null)
            {
                return JsonSuccess();
            }

            if (question.Answers.Count() <= 2)
            {
                return BadRequest();
            }

            question.DeleteAnswer(answer, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [EntityCollaborator(typeof(RankingTextAnswer))]
        [Route("api/question/rankingText/answer/updateText")]
        public ActionResult UpdateAnswerText(RankingTextAnswer rankingTextAnswer, string value)
        {
            if (rankingTextAnswer == null)
            {
                return HttpNotFound(Errors.AnswerNotFoundError);
            }
            if (value == null)
            {
                return BadRequest();
            }

            rankingTextAnswer.UpdateText(value, GetCurrentUsername());
            return JsonSuccess();
        }
    }
}