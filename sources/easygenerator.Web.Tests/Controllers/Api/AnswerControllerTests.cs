using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class AnswerControllerTests
    {
        private IPrincipal _user;
        private HttpContextBase _context;
        private IEntityFactory _entityFactory;
        private IEntityMapper _entityMapper;

        AnswerController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller = new AnswerController(_entityFactory, _entityMapper);
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

            var question = Substitute.For<Multipleselect>();
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

            var result = _controller.Create(Substitute.For<Multipleselect>(), text, isCorrect);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = answer.Id.ToNString(), CreatedOn = answer.CreatedOn });
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
            var question = Substitute.For<Multipleselect>();

            var result = _controller.Delete(question, null);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveAnswerFromQuestion()
        {
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Multipleselect>();
            var answer = Substitute.For<Answer>();

            _controller.Delete(question, answer);

            question.Received().RemoveAnswer(answer, user);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResultWithModifiedOnDate()
        {
            var question = Substitute.For<Multipleselect>();

            var result = _controller.Delete(question, Substitute.For<Answer>());

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Update

        [TestMethod]
        public void Update_ShouldReturnJsonErrorResult_WhenAnswerIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.Update(null, null, false);

            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be("Answer is not found");
        }


        [TestMethod]
        public void Update_ShouldUpdateAnswerText()
        {
            const string text = "updated text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var answer = Substitute.For<Answer>();

            _controller.Update(answer, text, false);

            answer.Received().UpdateText(text, user);
        }

        [TestMethod]
        public void Update_ShouldUpdateAnswerCorrectness()
        {
            const bool isCorrect = true;
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var answer = Substitute.For<Answer>();

            _controller.Update(answer, "", isCorrect);

            answer.Received().UpdateCorrectness(isCorrect, user);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var answer = Substitute.For<Answer>();

            var result = _controller.Update(answer, String.Empty, false);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = answer.ModifiedOn });
        }

        #endregion

        #region UpdateText

        [TestMethod]
        public void UpdateText_ShouldReturnJsonErrorResult_WhenAnswerIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateText(null, null);

            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be("Answer is not found");
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

        #region SingleSelectTextChangeCorrectAnswer

        [TestMethod]
        public void SingleSelectTextChangeCorrectAnswer_ShouldReturnHttpNotFoundResult_WhenQuestionIsNulll()
        {
            var result = _controller.SingleSelectTextChangeCorrectAnswer(null, null);

            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be("Question is not found");
        }

        [TestMethod]
        public void SingleSelectTextChangeCorrectAnswer_ShouldReturnHttpNotFoundResult_WhenAnswerIsNotFound()
        {
            var question = Substitute.For<SingleSelectText>();

            var result = _controller.SingleSelectTextChangeCorrectAnswer(question, null);

            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be("Answer is not found");
        }

        [TestMethod]
        public void SingleSelectTextChangeCorrectAnswer_ShouldSetAllAnswersToIncorectAndCurrentAnsweToCorrect()
        {
            var question = Substitute.For<SingleSelectText>();
            var answer = Substitute.For<Answer>();
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);

            _controller.SingleSelectTextChangeCorrectAnswer(question, answer);

            question.Received().SetCorrectAnswer(answer, user);
        }

        [TestMethod]
        public void SingleSelectTextChangeCorrectAnswer_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<SingleSelectText>();
            var answer = Substitute.For<Answer>();

            var result = _controller.SingleSelectTextChangeCorrectAnswer(question, answer);
            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = answer.CreatedOn });
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
            var question = MultipleselectObjectMother.Create();
            question.AddAnswer(AnswerObjectMother.Create(), "Some user");

            //Act
            var result = _controller.GetCollection(question);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
