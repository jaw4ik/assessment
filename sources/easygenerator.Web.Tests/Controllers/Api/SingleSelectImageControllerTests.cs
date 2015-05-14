using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.QuestionEvents;
using easygenerator.DomainModel.Events.QuestionEvents.SingleSelectImageEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class SingleSelectImageControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const string Url = "http://url.com";

        private SingleSelectImageController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;
        private IEntityMapper _entityMapper;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _controller = new SingleSelectImageController(_entityFactory, _entityMapper);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create question

        [TestMethod]
        public void Create_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void Create_ShouldAddTwoAnswerOptionsToQuestion()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var objective = Substitute.For<Objective>();
            var question = SingleSelectImageObjectMother.Create();

            var answer = Substitute.For<SingleSelectImageAnswer>(user, DateTimeWrapper.Now());

            _entityFactory.SingleSelectImageAnswer(Arg.Any<string>(), Arg.Any<DateTime>()).Returns(answer);
            _entityFactory.SingleSelectImageQuestion(title, user, answer, answer).Returns(question);
            
            _controller.Create(objective, title);

            _entityFactory.Received().SingleSelectImageQuestion(title, user, answer, answer);
        }

        [TestMethod]
        public void Create_ShouldAddQuestionToObjective()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var objective = Substitute.For<Objective>();
            var question = Substitute.For<SingleSelectImage>();

            _entityFactory.SingleSelectImageQuestion(title, user, Arg.Any<SingleSelectImageAnswer>(), Arg.Any<SingleSelectImageAnswer>()).Returns(question);

            _controller.Create(objective, title);

            objective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var question = Substitute.For<SingleSelectImage>();

            _entityFactory.SingleSelectImageQuestion(title, user, Arg.Any<SingleSelectImageAnswer>(), Arg.Any<SingleSelectImageAnswer>()).Returns(question);

            var result = _controller.Create(Substitute.For<Objective>(), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region Create answer

        [TestMethod]
        public void CreateAnswer_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.CreateAnswer(null, Url);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void CreateAnswer_ShouldReturnBadRequest_WhenImageUrlIsNull()
        {
            //Arrange


            //Act
            var result = _controller.CreateAnswer(Substitute.For<SingleSelectImage>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }


        [TestMethod]
        public void CreateAnswer_ShouldAddAnswer()
        {
            //Arrange
            var question = Substitute.For<SingleSelectImage>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            var answer = Substitute.For<SingleSelectImageAnswer>(Url, username);
            _entityFactory.SingleSelectImageAnswer(Url, username).Returns(answer);

            //Act
            _controller.CreateAnswer(question, Url);

            //Assert
            question.Received().AddAnswer(answer, username);
        }

        [TestMethod]
        public void CreateAnswer_ShouldReturnJsonSuccessWithAnswerId()
        {
            //Arrange
            var answer = Substitute.For<SingleSelectImageAnswer>();
            const string username = "username";
            _user.Identity.Name.Returns(username);

            _entityFactory.SingleSelectImageAnswer(Url, username).Returns(answer);

            //Act
            var result = _controller.CreateAnswer(Substitute.For<SingleSelectImage>(), Url);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().Be(answer.Id.ToNString());
        }

        #endregion

        #region Delete answer

        [TestMethod]
        public void DeleteAnswer_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.DeleteAnswer(null, Substitute.For<SingleSelectImageAnswer>());

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void DeleteAnswer_ShouldReturnBadRequest_WhenAnswerIsNull()
        {
            //Arrange


            //Act
            var result = _controller.DeleteAnswer(Substitute.For<SingleSelectImage>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void DeleteAnswer_ShouldReturnBadRequest_WhenAnswersCountIsMinimal()
        {
            //Arrange
            var question = SingleSelectImageObjectMother.Create();
            question.AddAnswer(Substitute.For<SingleSelectImageAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<SingleSelectImageAnswer>(), CreatedBy);

            //Act
            var result = _controller.DeleteAnswer(question, Substitute.For<SingleSelectImageAnswer>());

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void DeleteAnswer_ShouldDeleteAnswer()
        {
            //Arrange
            var question = SingleSelectImageObjectMother.Create();
            var answer = Substitute.For<SingleSelectImageAnswer>();
            question.AddAnswer(answer, CreatedBy);
            question.AddAnswer(Substitute.For<SingleSelectImageAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<SingleSelectImageAnswer>(), CreatedBy);

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.DeleteAnswer(question, answer);

            //Assert
            question.Answers.Count().Should().Be(2);
        }

        [TestMethod]
        public void DeleteAnswer_ShouldReturnJsonSuccess()
        {
            //Arrange
            var question = SingleSelectImageObjectMother.Create();
            question.AddAnswer(Substitute.For<SingleSelectImageAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<SingleSelectImageAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<SingleSelectImageAnswer>(), CreatedBy);

            const string username = "username";
            _user.Identity.Name.Returns(username);

            var answer = Substitute.For<SingleSelectImageAnswer>(Url, username);

            //Act
            var result = _controller.DeleteAnswer(question, answer);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Update answer image

        [TestMethod]
        public void UpdateAnswerImage_ShouldReturnBadRequest_WhenAnswerIsNull()
        {
            //Arrange


            //Act
            var result = _controller.UpdateAnswerImage(null, Url);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void UpdateAnswerImage_ShouldReturnBadRequest_WhenImageIsNull()
        {
            //Arrange


            //Act
            var result = _controller.UpdateAnswerImage(Substitute.For<SingleSelectImageAnswer>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void UpdateAnswerImage_ShouldChangeAnswerImage()
        {
            //Arrange
            var answer = Substitute.For<SingleSelectImageAnswer>(Url, CreatedBy);

            _user.Identity.Name.Returns(CreatedBy);

            //Act
            _controller.UpdateAnswerImage(answer, Url);

            //Assert
            answer.Received().UpdateImage(Url, CreatedBy);
        }

        [TestMethod]
        public void UpdateAnswerImage_ShouldReturnJsonSuccess()
        {
            //Arrange
            var question = Substitute.For<SingleSelectImage>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            var answer = Substitute.For<SingleSelectImageAnswer>(Url, username);

            //Act
            var result = _controller.UpdateAnswerImage(answer, Url);

            //Assert
            result.Should().BeJsonSuccessResult();
        }


        #endregion

        #region Set correct answer

        [TestMethod]
        public void SetCorrectAnswer_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.SetCorrectAnswer(null, Substitute.For<SingleSelectImageAnswer>());

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldReturnBadRequest_WhenAnswerIsNull()
        {
            //Arrange


            //Act
            var result = _controller.SetCorrectAnswer(Substitute.For<SingleSelectImage>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldSetCorrectAnswer()
        {
            //Arrange
            var answer = Substitute.For<SingleSelectImageAnswer>(Url, CreatedBy);
            var question = Substitute.For<SingleSelectImage>();

            _user.Identity.Name.Returns(CreatedBy);

            //Act
            _controller.SetCorrectAnswer(question, answer);

            //Assert
            question.Received().SetCorrectAnswer(answer, CreatedBy);
        }

        [TestMethod]
        public void SetCorrectAnswer_ShouldReturnJsonSuccess()
        {
            //Arrange
            var answer = Substitute.For<SingleSelectImageAnswer>(Url, CreatedBy);
            var question = Substitute.For<SingleSelectImage>();

            _user.Identity.Name.Returns(CreatedBy);

            //Act
            var result = _controller.SetCorrectAnswer(question, answer);

            //Assert
            result.Should().BeJsonSuccessResult();
        }


        #endregion

        #region Get question content

        [TestMethod]
        public void GetQuestionContent_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Arrange


            //Act
            var result = _controller.GetQuestionContent(null);

            //Assert
            result.Should().BeBadRequestResult();
        }


        [TestMethod]
        public void GetQuestionContent_ShouldReturnJsonSuccess()
        {
            //Arrange


            //Act
            var result = _controller.GetQuestionContent(SingleSelectImageObjectMother.Create());

            //Assert
            result.Should().BeJsonSuccessResult();

        }

        #endregion
    }
}
