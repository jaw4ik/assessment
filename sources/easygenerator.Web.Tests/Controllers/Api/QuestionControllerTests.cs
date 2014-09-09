using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class QuestionControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private QuestionController _controller;

        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _controller = new QuestionController();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Delete questions

        [TestMethod]
        public void Delete_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            var result = _controller.Delete(null, new List<Question>() { });

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

        #region GetQuestionFeedback

        [TestMethod]
        public void GetQuestionFeedback_ShouldReturnJsonError_WhenQuestionIsNull()
        {
            var result = _controller.GetQuestionFeedback(null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }

        [TestMethod]
        public void GetQuestionFeedback_ShouldReturnJsonSuccessResultWithFeedbackTexts()
        {
            var question = MultipleselectObjectMother.Create();
            question.UpdateCorrectFeedbackText("Correct feedback");
            question.UpdateIncorrectFeedbackText("Incorrect feedback");

            var result = _controller.GetQuestionFeedback(question);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new
            {
                ModifiedOn = question.ModifiedOn,
                CorrectFeedbackText = "Correct feedback",
                IncorrectFeedbackText = "Incorrect feedback"
            });
        }

        #endregion

        #region UpdateCorrectFeedback

        [TestMethod]
        public void UpdateCorrectFeedback_ShouldReturnJsonError_WhenQuestionIsNull()
        {
            var result = _controller.UpdateCorrectFeedback(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }

        [TestMethod]
        public void UpdateCorrectFeedback_ShouldUpdateQuestionFeedback()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);
            _controller.UpdateCorrectFeedback(question, "correct feedback");

            question.Received().UpdateCorrectFeedbackText("correct feedback");
        }

        [TestMethod]
        public void UpdateCorrectFeedback_ShouldReturnJsonSuccessResult()
        {
            var question = MultipleselectObjectMother.Create("Question title", CreatedBy);

            var result = _controller.UpdateCorrectFeedback(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region UpdateIncorrectFeedback

        [TestMethod]
        public void UpdateIncorrectFeedback_ShouldReturnJsonError_WhenQuestionIsNull()
        {
            var result = _controller.UpdateIncorrectFeedback(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }

        [TestMethod]
        public void UpdateIncorrectFeedback_ShouldUpdateQuestionFeedback()
        {
            var question = Substitute.For<Question>("Question title", CreatedBy);

            _controller.UpdateIncorrectFeedback(question, "incorrect feedback");

            question.Received().UpdateIncorrectFeedbackText("incorrect feedback");
        }

        [TestMethod]
        public void UpdateIncorrectFeedback_ShouldReturnJsonSuccessResult()
        {
            var question = MultipleselectObjectMother.Create("Question title", CreatedBy);

            var result = _controller.UpdateIncorrectFeedback(question, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

    }
}
