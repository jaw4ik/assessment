using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Infrastructure.Http;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class ScenarioControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private ScenarioController _controller;

        IEntityFactory _entityFactory;
        IUserRepository _userRepository;
        BranchTrackProvider _branchTrackProvider;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _userRepository = Substitute.For<IUserRepository>();
            _branchTrackProvider = Substitute.For<BranchTrackProvider>(Substitute.For<HttpClient>(), Substitute.For<ConfigurationReader>());
            _controller = new ScenarioController(_entityFactory, _userRepository, _branchTrackProvider);

            _user = Substitute.For<IPrincipal>();
            _user.Identity.Name.Returns(CreatedBy);
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);

            DateTimeWrapper.Now = () => DateTime.UtcNow;
        }

        #region Create

        [TestMethod]
        public void Create_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void Create_ShouldAddQuestionToObjective()
        {
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = ScenarioObjectMother.Create();
            _entityFactory.Scenario(Arg.Any<string>(), Arg.Any<int>(), Arg.Any<string>()).Returns(question);

            _controller.Create(objective, "title");

            objective.Received().AddQuestion(question, CreatedBy);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            var question = ScenarioObjectMother.Create();
            _entityFactory.Scenario(Arg.Any<string>(), Arg.Any<int>(), Arg.Any<string>()).Returns(question);

            var result = _controller.Create(ObjectiveObjectMother.Create(), "title");

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region GetQuestionData

        [TestMethod]
        public void GetQuestionData_ShouldReturnJsonLocalizableError_WhenQuestionIsNull()
        {
            var result = _controller.GetQuestionData(null);

            result.Should().BeJsonErrorResultWithMessage(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void GetQuestionData_ShouldReturnQuestionContent()
        {
            var question = ScenarioObjectMother.Create();
            question.EmbedCode = "embed_code";
            question.EmbedUrl = "embed_url";
            question.ProjectId = "project_id";
            question.MasteryScore = 95;

            var result = _controller.GetQuestionData(question);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new
                {
                    projectId = question.ProjectId,
                    embedCode = question.EmbedCode,
                    embedUrl = question.EmbedUrl,
                    masteryScore = question.MasteryScore
                });
        }

        #endregion

        #region UpdateData

        [TestMethod]
        public void UpdateData_ShouldReturnJsonLocalizableError_WhenQuestionIsNull()
        {
            var result = _controller.UpdateData(null, null, null, null, null);

            result.Should().BeJsonErrorResultWithMessage(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void UpdateData_ShouldCallQuestionUpdateData()
        {
            var embedCode = "embed_code";
            var embedUrl = "embed_url";
            var projectId = "project_id";
            var projectAchiveUrl = "project_zip";
            var question = Substitute.For<Scenario>();

            _controller.UpdateData(question, projectId, embedCode, embedUrl, projectAchiveUrl);

            question.Received().UpdateData(projectId, embedCode, embedUrl, projectAchiveUrl, CreatedBy);
        }

        [TestMethod]
        public void UpdateData_ShouldReturnJsonSuccessResult()
        {
            var embedCode = "embed_code";
            var embedUrl = "embed_url";
            var projectId = "project_id";
            var projectAchiveUrl = "project_zip";
            var question = ScenarioObjectMother.Create();

            var result = _controller.UpdateData(question, projectId, embedCode, embedUrl, projectAchiveUrl);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new
                {
                    projectId = projectId,
                    embedCode = embedCode,
                    embedUrl = embedUrl
                });
        }

        #endregion

        #region UpdateMasteryScore

        [TestMethod]
        public void UpdateMasteryScore_ShouldReturnJsonLocalizableError_WhenQuestionIsNull()
        {
            var result = _controller.UpdateMasteryScore(null, 0);

            result.Should().BeJsonErrorResultWithMessage(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void UpdateMasteryScore_ShouldCallQuestionUpdateMasteryScore()
        {
            var masteryScore = 40;
            var question = Substitute.For<Scenario>();

            _controller.UpdateMasteryScore(question, masteryScore);

            question.Received().UpdateMasteryScore(masteryScore, CreatedBy);
        }

        [TestMethod]
        public void UpdateMasteryScore_ShouldReturnJsonSuccessResult()
        {
            var question = ScenarioObjectMother.Create();

            var result = _controller.UpdateMasteryScore(question, 0);

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region GetDashboardInfo

        [TestMethod]
        public void GetDashboardInfo_ShouldReturnJsonError_WhenUserDoesNotExist()
        {
            _userRepository.GetUserByEmail(CreatedBy).Returns((User)null);

            var result = _controller.GetDashboardInfo();

            result.Should().BeJsonErrorResultWithMessage(Errors.UserWithSpecifiedEmailDoesntExist);
        }

        [TestMethod]
        public void GetDashboardInfo_ShouldCallProviderGetDashboardInfo()
        {
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(CreatedBy).Returns(user);

            _controller.GetDashboardInfo();

            _branchTrackProvider.Received().GetDashboardInfo(user.Id.ToNString());
        }

        [TestMethod]
        public void GetDashboardInfo_ShouldReturnJsonSuccessResultWithDashboardInfo()
        {
            var user = UserObjectMother.Create();
            var expectedResult = new { someData = "data" };
            _userRepository.GetUserByEmail(CreatedBy).Returns(user);
            _branchTrackProvider.GetDashboardInfo(Arg.Any<string>()).Returns(expectedResult);

            var result = _controller.GetDashboardInfo();

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(expectedResult);
        }

        #endregion

        #region GetProjectInfo

        [TestMethod]
        public void GetProjectInfo_ShouldReturnJsonError_WhenProjectIdIsNull()
        {
            var result = _controller.GetProjectInfo(null);

            result.Should().BeJsonErrorResultWithMessage(Errors.ProjectDoesntExist);
        }

        [TestMethod]
        public void GetProjectInfo_ShouldCallProviderGetProjectInfo()
        {
            var projectId = "some_project_id";
            _controller.GetProjectInfo(projectId);

            _branchTrackProvider.Received().GetProjectInfo(projectId);
        }

        [TestMethod]
        public void GetProjectInfo_ShouldReturnJsonSuccessResultWithProjectInfo()
        {
            var projectId = "some_project_id";
            var expectedResult = new { someData = "data" };
            _branchTrackProvider.GetProjectInfo(projectId).Returns(expectedResult);

            var result = _controller.GetProjectInfo(projectId);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(expectedResult);
        }

        #endregion

        #region GetProjectEditingInfo

        [TestMethod]
        public void GetProjectEditingInfo_ShouldReturnJsonError_WhenUserDoesNotExist()
        {
            _userRepository.GetUserByEmail(CreatedBy).Returns((User)null);

            var result = _controller.GetProjectEditingInfo("some_project_id");

            result.Should().BeJsonErrorResultWithMessage(Errors.UserWithSpecifiedEmailDoesntExist);
        }

        [TestMethod]
        public void GetProjectEditingInfo_ShouldReturnJsonError_WhenProjectIdIsNull()
        {
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(CreatedBy).Returns(user);

            var result = _controller.GetProjectEditingInfo(null);

            result.Should().BeJsonErrorResultWithMessage(Errors.ProjectDoesntExist);
        }

        [TestMethod]
        public void GetProjectEditingInfo_ShouldCallProviderGetProjectEditingInfo()
        {
            var projectId = "some_project_id";
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(CreatedBy).Returns(user);

            _controller.GetProjectEditingInfo(projectId);

            _branchTrackProvider.Received().GetProjectEditingInfo(user.Id.ToNString(), projectId);
        }

        [TestMethod]
        public void GetProjectEditingInfo_ShouldReturnJsonSuccessResultWithProjectInfo()
        {
            var projectId = "some_project_id";
            var expectedResult = new { someData = "data" };
            var user = UserObjectMother.Create();
            _userRepository.GetUserByEmail(CreatedBy).Returns(user);
            _branchTrackProvider.GetProjectEditingInfo(user.Id.ToNString(), projectId).Returns(expectedResult);

            var result = _controller.GetProjectEditingInfo(projectId);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(expectedResult);
        }

        #endregion
    }
}
