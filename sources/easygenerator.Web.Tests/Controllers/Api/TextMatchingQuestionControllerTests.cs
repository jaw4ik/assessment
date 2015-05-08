using System;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
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
    public class TextMatchingQuestionControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private TextMatchingQuestionController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;
        private IEntityMapper _entityMapper;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _entityMapper = Substitute.For<IEntityMapper>();

            _controller = new TextMatchingQuestionController(_entityFactory, _entityMapper);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create question

        [TestMethod]
        public void CreateTextMatching_ShouldReturnJsonErrorResult_WnenObjectiveIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }

        [TestMethod]
        public void CreateTextMatching_ShouldAddTwoAnswerOptionsToQuestion()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<TextMatching>("Question title", CreatedBy);
            var defaultAnswer1 = Substitute.For<TextMatchingAnswer>("Define your key...", "Define your answer...", user);
            var defaultAnswer2 = Substitute.For<TextMatchingAnswer>("Define your key...", "Define your answer...", user, DateTimeWrapper.Now().AddSeconds(1));

            _entityFactory.TextMatchingQuestion(title, user, defaultAnswer1, defaultAnswer2).Returns(question);
            _entityFactory.TextMatchingAnswer("Define your key...", "Define your answer...", user).Returns(defaultAnswer1);
            _entityFactory.TextMatchingAnswer("Define your key...", "Define your answer...", user, DateTimeWrapper.Now().AddSeconds(1)).Returns(defaultAnswer2);

            _controller.Create(objective, title);

            _entityFactory.Received().TextMatchingQuestion(title, user, defaultAnswer1, defaultAnswer2);
        }

        [TestMethod]
        public void CreateTextMatching_ShouldAddQuestionToObjective()
        {
            const string title = "title";
            var user = "Test user";
            DateTimeWrapper.Now = () => DateTime.MinValue;
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Objective title", CreatedBy);
            var question = Substitute.For<TextMatching>("Question title", CreatedBy);

            _entityFactory.TextMatchingQuestion(title, user, Arg.Any<TextMatchingAnswer>(), Arg.Any<TextMatchingAnswer>()).Returns(question);

            _controller.Create(objective, title);

            objective.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void CreateTextMatching_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var question = Substitute.For<TextMatching>("Question title", CreatedBy);

            _entityFactory.TextMatchingQuestion(title, user, Arg.Any<TextMatchingAnswer>(), Arg.Any<TextMatchingAnswer>()).Returns(question);

            var result = _controller.Create(Substitute.For<Objective>("Objective title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region Create Answer

        [TestMethod]
        public void CreateTextMatchingAnswer_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Act
            var result = _controller.CreateAnswer(null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void CreateTextMatchingAnswer_ShouldAddAnswer()
        {
            //Arrange
            var question = Substitute.For<TextMatching>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            var answer = Substitute.For<TextMatchingAnswer>("Define your key...", "Define your answer...", username);
            _entityFactory.TextMatchingAnswer("Define your key...", "Define your answer...", username).Returns(answer);

            //Act
            _controller.CreateAnswer(question);

            //Assert
            question.Received().AddAnswer(answer, username);
        }

        [TestMethod]
        public void CreateTextMatchingAnswer_ShouldReturnJsonSuccess()
        {
            //Arrange
            const string username = "username";
            _user.Identity.Name.Returns(username);

            var answer = Substitute.For<TextMatchingAnswer>("Define your key...", "Define your answer...", username);
            _entityFactory.TextMatchingAnswer(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>()).Returns(answer);

            //Act
            var result = _controller.CreateAnswer(Substitute.For<TextMatching>());

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Delete Answer

        [TestMethod]
        public void DeleteTextMatchingAnswer_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Act
            var result = _controller.DeleteAnswer(null, Substitute.For<TextMatchingAnswer>());

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void DeleteTextMatchingAnswer_ShouldReturnBadRequest_WhenAnswerIsNull()
        {
            //Act
            var result = _controller.DeleteAnswer(Substitute.For<TextMatching>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void DeleteTextMatchingAnswer_ShouldReturnBadRequest_WhenAnswersCountIsMinimal()
        {
            //Arrange
            var question = TextMatchingObjectMother.Create();
            question.AddAnswer(Substitute.For<TextMatchingAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<TextMatchingAnswer>(), CreatedBy);

            //Act
            var result = _controller.DeleteAnswer(question, Substitute.For<TextMatchingAnswer>());

            //Assert
            result.Should().BeBadRequestResult();
        }


        [TestMethod]
        public void DeleteTextMatchingAnswer_ShouldRemoveAnswer()
        {
            //Arrange
            var answer = Substitute.For<TextMatchingAnswer>();
            var question = TextMatchingObjectMother.Create();

            question.AddAnswer(answer, CreatedBy);
            question.AddAnswer(Substitute.For<TextMatchingAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<TextMatchingAnswer>(), CreatedBy);

            //Act
            _controller.DeleteAnswer(question, answer);

            //Assert
            question.Answers.Count().Should().Be(2);
        }

        [TestMethod]
        public void DeleteTextMatchingAnswer_ShouldReturnJsonSuccess()
        {
            //Arrange
            var answer = Substitute.For<TextMatchingAnswer>();
            var question = TextMatchingObjectMother.Create();

            question.AddAnswer(answer, CreatedBy);
            question.AddAnswer(Substitute.For<TextMatchingAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<TextMatchingAnswer>(), CreatedBy);

            //Act
            var result = _controller.DeleteAnswer(question, answer);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Change Answer Key

        [TestMethod]
        public void ChangeTextMatchingAnswerKey_ShouldReturnBadRequest_WhenAnswerIsNull()
        {
            //Act
            var result = _controller.ChangeAnswerKey(null, "key");

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeTextMatchingAnswerKey_ShouldReturnBadRequest_WhenKeyIsNull()
        {
            //Act
            var result = _controller.ChangeAnswerKey(Substitute.For<TextMatchingAnswer>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeTextMatchingAnswerKey_ShouldChangeAnswerKey()
        {
            //Arrange
            var answer = Substitute.For<TextMatchingAnswer>();
            const string key = "key";

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.ChangeAnswerKey(answer, key);

            //Assert
            answer.Received().ChangeKey(key, username);
        }

        #endregion

        #region Change Answer Value

        [TestMethod]
        public void ChangeTextMatchingAnswerValue_ShouldReturnBadRequest_WhenAnswerIsNull()
        {
            //Act
            var result = _controller.ChangeAnswerValue(null, "value");

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeTextMatchingAnswerValue_ShouldReturnBadRequest_WhenValueIsNull()
        {
            //Act
            var result = _controller.ChangeAnswerValue(Substitute.For<TextMatchingAnswer>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void ChangeTextMatchingAnswerValue_ShouldChangeAnswerValue()
        {
            //Arrange
            var answer = Substitute.For<TextMatchingAnswer>();
            const string value = "value";

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.ChangeAnswerValue(answer, value);

            //Assert
            answer.Received().ChangeValue(value, username);
        }

        #endregion
    }
}
