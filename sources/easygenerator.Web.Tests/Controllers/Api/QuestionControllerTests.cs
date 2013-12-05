using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class QuestionControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private QuestionController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _controller = new QuestionController(_entityFactory);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new QuestionController(_entityFactory);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create question

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
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<Question>("Question title", CreatedBy);

            _entityFactory.Question(title, user).Returns(question);

            _controller.Create(objective, title);

            objective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", CreatedBy);

            _entityFactory.Question(title, user).Returns(question);

            var result = _controller.Create(Substitute.For<Objective>("Objective title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToString("N"), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region Delete questions

        [TestMethod]
        public void Delete_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            var result = _controller.Delete(null, new List<Question>(){ });

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");  
        }

        [TestMethod]
        public void Delete_ShouldReturnBadRequest_WnenQuestionsIsNull()
        {
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            
            var result = _controller.Delete(objective, null);

            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        [TestMethod]
        public void Delete_ShouldRemoveQuestionsFromObjective()
        {
            var user = "Test user";
            _user.Identity.Name.Returns(user);

            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question1 = Substitute.For<Question>("Question title 1", CreatedBy);
            var question2 = Substitute.For<Question>("Question title 2", CreatedBy);

            _controller.Delete(objective, new List<Question>() { question1, question2 });

            objective.Received().RemoveQuestion(question1, user);
            objective.Received().RemoveQuestion(question2, user);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question1 = Substitute.For<Question>("Question title 1", CreatedBy);
            var question2 = Substitute.For<Question>("Question title 2", CreatedBy);

            var result = _controller.Delete(objective, new List<Question>() { question1, question2 });

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = objective.ModifiedOn });
        }

        #endregion

        #region Update title

        [TestMethod]
        public void Update_ShouldReturnJsonErrorResult_WhenQuestionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");  
        }


        [TestMethod]
        public void Update_ShouldUpdateQuestionTitle()
        {
            const string title = "updated title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", CreatedBy);

            _controller.UpdateTitle(question, title);

            question.Received().UpdateTitle(title, user);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);

            var result = _controller.UpdateTitle(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Update content

        [TestMethod]
        public void UpdateContent_ShouldReturnJsonErrorResult_WhenQuestionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }


        [TestMethod]
        public void UpdateContent_ShouldUpdateQuestionContent()
        {
            const string content = "updated content";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>("Question title", CreatedBy);

            _controller.UpdateContent(question, content);

            question.Received().UpdateContent(content, user);
        }

        [TestMethod]
        public void UpdateContent_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);

            var result = _controller.UpdateContent(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

    }
}
