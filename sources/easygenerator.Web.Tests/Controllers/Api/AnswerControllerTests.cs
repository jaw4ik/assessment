using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class AnswerControllerTests
    {
        IPrincipal _user;
        HttpContextBase _context;
        IEntityFactory _entityFactory;

        AnswerController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new AnswerController(_entityFactory);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create

        [TestMethod]
        public void Create_ShouldReturnJsonErrorResult_WnenQuestionIsNull()
        {
            const string text = "text";
            const bool isCorrect = true;
            var result = _controller.Create(null, text, isCorrect);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");  
        }

        [TestMethod]
        public void Create_ShouldAddAnswerToQuestion()
        {
            const string text = "text";
            const bool isCorrect = true;
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);

            var question = Substitute.For<Question>();
            var answer = Substitute.For<Answer>();

            _entityFactory.Answer(text, isCorrect, user).Returns(answer);

            _controller.Create(question, text, isCorrect);

            question.Received().AddAnswer(answer, user);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string text = "text";
            const bool isCorrect = true;
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var answer = Substitute.For<Answer>();

            _entityFactory.Answer(text, isCorrect, user).Returns(answer);

            var result = _controller.Create(Substitute.For<Question>(), text, isCorrect);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = answer.Id.ToString("N"), CreatedOn = answer.CreatedOn });
        }

        #endregion

        #region Delete

        [TestMethod]
        public void Delete_ShouldReturnJsonErrorResult_WnenQuestionIsNull()
        {
            var result = _controller.Delete(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");  
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult_WnenAnswerIsNull()
        {
            var question = Substitute.For<Question>();

            var result = _controller.Delete(question, null);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveAnswerFromQuestion()
        {
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>();
            var answer = Substitute.For<Answer>();

            _controller.Delete(question, answer);

            question.Received().RemoveAnswer(answer, user);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResultWithModifiedOnDate()
        {
            var question = Substitute.For<Question>();

            var result = _controller.Delete(question, Substitute.For<Answer>());

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Update text

        [TestMethod]
        public void UpdateText_ShouldReturnJsonErrorResult_WhenAnswerIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateText(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Answer is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("answerNotFoundError");  
        }


        [TestMethod]
        public void UpdateText_ShouldUpdateAnswerText()
        {
            const string text = "updated text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var answer = Substitute.For<Answer>();

            _controller.UpdateText(answer, text);

            answer.Received().UpdateText(text, user);
        }

        [TestMethod]
        public void UpdateText_ShouldReturnJsonSuccessResult()
        {
            var answer = Substitute.For<Answer>();

            var result = _controller.UpdateText(answer, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = answer.ModifiedOn });
        }

        #endregion

        #region Update correctness

        [TestMethod]
        public void UpdateCorrectness_ShouldReturnJsonErrorResult_WhenAnswerIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateCorrectness(null, true);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Answer is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("answerNotFoundError");  
        }


        [TestMethod]
        public void UpdateCorrectness_ShouldUpdateAnswerCorrectness()
        {
            const bool isCorrect = true;
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var answer = Substitute.For<Answer>();

            _controller.UpdateCorrectness(answer, isCorrect);

            answer.Received().UpdateCorrectness(isCorrect, user);
        }

        [TestMethod]
        public void UpdateCorrectness_ShouldReturnJsonSuccessResult()
        {
            var answer = Substitute.For<Answer>();

            var result = _controller.UpdateCorrectness(answer, true);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = answer.ModifiedOn });
        }

        #endregion

        #region Get collection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonErrorResult_WhenQuestionNotFound()
        {
            //Arrange

            //Act
            var result = _controller.GetCollection(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var question = QuestionObjectMother.Create();
            question.AddAnswer(AnswerObjectMother.Create(), "Some user");

            //Act
            var result = _controller.GetCollection(question);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
