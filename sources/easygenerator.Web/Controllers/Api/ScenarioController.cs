using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Components.ActionFilters.Permissions;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class ScenarioController : DefaultApiController
    {
        private const int DefaultMasteryScoreValue = 80;

        private readonly IEntityFactory _entityFactory;
        private readonly IUserRepository _userRepository;
        private readonly BranchTrackProvider _branchTrackProvider;

        public ScenarioController(IEntityFactory entityFactory, IUserRepository userRepository, BranchTrackProvider branchTrackProvider)
        {
            _entityFactory = entityFactory;
            _userRepository = userRepository;
            _branchTrackProvider = branchTrackProvider;
        }

        [HttpPost]
        [EntityCollaborator(typeof(Objective))]
        [AcademyAccess(ErrorMessageResourceKey = Errors.UpgradeAccountToCreateAdvancedQuestionTypes)]
        [Route("api/question/" + Question.QuestionTypes.Scenario + "/create")]
        public ActionResult Create(Objective objective, string title)
        {
            if (objective == null)
            {
                return JsonLocalizableError(Errors.ObjectiveNotFoundError, Errors.ObjectiveNotFoundResourceKey);
            }

            var question = _entityFactory.Scenario(title, DefaultMasteryScoreValue, GetCurrentUsername());

            objective.AddQuestion(question, GetCurrentUsername());

            return JsonSuccess(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/scenario")]
        public ActionResult GetQuestionData(Scenario question)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            return JsonSuccess(new
            {
                projectId = question.ProjectId,
                embedCode = question.EmbedCode,
                embedUrl = question.EmbedUrl,
                masteryScore = question.MasteryScore
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/scenario/updatedata")]
        public ActionResult UpdateData(Scenario question, string projectId, string embedCode, string embedUrl, string projectArchiveUrl)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateData(projectId, embedCode, embedUrl, projectArchiveUrl, GetCurrentUsername());

            return JsonSuccess(new
            {
                projectId = question.ProjectId,
                embedCode = question.EmbedCode,
                embedUrl = question.EmbedUrl
            });
        }

        [HttpPost]
        [EntityCollaborator(typeof(Question))]
        [Route("api/question/scenario/updatemasteryscore")]
        public ActionResult UpdateMasteryScore(Scenario question, int masteryScore)
        {
            if (question == null)
            {
                return JsonLocalizableError(Errors.QuestionNotFoundError, Errors.QuestionNotFoundResourceKey);
            }

            question.UpdateMasteryScore(masteryScore, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/question/scenario/getdashboardinfo")]
        public ActionResult GetDashboardInfo()
        {
            var user = _userRepository.GetUserByEmail(GetCurrentUsername());
            if (user == null)
            {
                return JsonError(Errors.UserWithSpecifiedEmailDoesntExist);
            }

            return JsonSuccess(_branchTrackProvider.GetDashboardInfo(user.Id.ToNString()));
        }

        [HttpPost]
        [Route("api/question/scenario/getprojectinfo")]
        public ActionResult GetProjectInfo(string projectId)
        {
            if (projectId == null)
            {
                return JsonError(Errors.ProjectDoesntExist);
            }

            return JsonSuccess(_branchTrackProvider.GetProjectInfo(projectId));
        }

        [HttpPost]
        [Route("api/question/scenario/getprojecteditinginfo")]
        public ActionResult GetProjectEditingInfo(string projectId)
        {
            var user = _userRepository.GetUserByEmail(GetCurrentUsername());
            if (user == null)
            {
                return JsonError(Errors.UserWithSpecifiedEmailDoesntExist);
            }

            if (projectId == null)
            {
                return JsonError(Errors.ProjectDoesntExist);
            }

            return JsonSuccess(_branchTrackProvider.GetProjectEditingInfo(user.Id.ToNString(), projectId));
        }
    }
}