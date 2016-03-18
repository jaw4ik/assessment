using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
    public class RankingTextControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private RankingTextController _controller;

        IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;
        private IEntityMapper _entityMapper;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _entityMapper = Substitute.For<IEntityMapper>();

            _controller = new RankingTextController(_entityFactory, _entityMapper);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create question

        [TestMethod]
        public void CreateRankingText_ShouldReturnJsonErrorResult_WnenSectionIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var result = _controller.Create(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Section is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("sectionNotFoundError");
        }

        [TestMethod]
        public void CreateRankingText_ShouldAddTwoAnswerOptionsToQuestion()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var section = Substitute.For<Section>("Section title", CreatedBy);
            var question = Substitute.For<RankingText>("Question title", CreatedBy);
            var defaultAnswer1 = Substitute.For<RankingTextAnswer>("", user);
            var defaultAnswer2 = Substitute.For<RankingTextAnswer>("", user, DateTimeWrapper.Now().AddSeconds(1));

            _entityFactory.RankingTextQuestion(title, user, defaultAnswer1, defaultAnswer2).Returns(question);
            _entityFactory.RankingTextAnswer("", user).Returns(defaultAnswer1);
            _entityFactory.RankingTextAnswer("", user, DateTimeWrapper.Now().AddSeconds(1)).Returns(defaultAnswer2);

            _controller.Create(section, title);

            _entityFactory.Received().RankingTextQuestion(title, user, defaultAnswer1, defaultAnswer2);
        }

        [TestMethod]
        public void CreateRankingText_ShouldAddQuestionToSection()
        {
            const string title = "title";
            var user = "Test user";
            DateTimeWrapper.Now = () => DateTime.MinValue;
            _user.Identity.Name.Returns(user);
            var section = Substitute.For<Section>("Section title", CreatedBy);
            var question = Substitute.For<RankingText>("Question title", CreatedBy);

            _entityFactory.RankingTextQuestion(title, user, Arg.Any<RankingTextAnswer>(), Arg.Any<RankingTextAnswer>()).Returns(question);

            _controller.Create(section, title);

            section.Received().AddQuestion(question, user);
        }

        [TestMethod]
        public void CreateRankingText_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            DateTimeWrapper.Now = () => DateTime.MinValue;
            var question = Substitute.For<RankingText>("Question title", CreatedBy);

            _entityFactory.RankingTextQuestion(title, user, Arg.Any<RankingTextAnswer>(), Arg.Any<RankingTextAnswer>()).Returns(question);

            var result = _controller.Create(Substitute.For<Section>("Section title", CreatedBy), title);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = question.Id.ToNString(), CreatedOn = question.CreatedOn });
        }

        #endregion

        #region AddAnswer

        [TestMethod]
        public void AddAnswer_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Act
            var result = _controller.AddAnswer(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void AddAnswer_ShouldAddAnswer()
        {
            //Arrange
            var question = Substitute.For<RankingText>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            var answer = Substitute.For<RankingTextAnswer>("", username);
            _entityFactory.RankingTextAnswer("", username).Returns(answer);

            //Act
            _controller.AddAnswer(question);

            //Assert
            question.Received().AddAnswer(answer, username);
        }

        [TestMethod]
        public void AddAnswer_ShouldReturnJsonSuccess()
        {
            //Arrange
            const string username = "username";
            _user.Identity.Name.Returns(username);

            var answer = Substitute.For<RankingTextAnswer>("", username);
            _entityFactory.RankingTextAnswer(Arg.Any<string>(), Arg.Any<string>()).Returns(answer);

            //Act
            var result = _controller.AddAnswer(Substitute.For<RankingText>());

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region DeleteAnswer

        [TestMethod]
        public void DeleteAnswer_ShouldReturnBadRequest_WhenQuestionIsNull()
        {
            //Act
            var result = _controller.DeleteAnswer(null, Substitute.For<RankingTextAnswer>());

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void DeleteAnswer_ShouldReturnBadRequest_WhenAnswerIsNull()
        {
            //Act
            var result = _controller.DeleteAnswer(Substitute.For<RankingText>(), null);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void DeleteAnswer_ShouldReturnBadRequest_WhenAnswersCountIsMinimal()
        {
            //Arrange
            var question = RankingTextObjectMother.Create();
            question.AddAnswer(Substitute.For<RankingTextAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<RankingTextAnswer>(), CreatedBy);

            //Act
            var result = _controller.DeleteAnswer(question, Substitute.For<RankingTextAnswer>());

            //Assert
            result.Should().BeBadRequestResult();
        }


        [TestMethod]
        public void DeleteAnswer_ShouldRemoveAnswer()
        {
            //Arrange
            var answer = Substitute.For<RankingTextAnswer>();
            var question = RankingTextObjectMother.Create();

            question.AddAnswer(answer, CreatedBy);
            question.AddAnswer(Substitute.For<RankingTextAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<RankingTextAnswer>(), CreatedBy);

            //Act
            _controller.DeleteAnswer(question, answer);

            //Assert
            question.Answers.Count().Should().Be(2);
        }

        [TestMethod]
        public void DeleteAnswer_ShouldReturnJsonSuccess()
        {
            //Arrange
            var answer = Substitute.For<RankingTextAnswer>();
            var question = RankingTextObjectMother.Create();

            question.AddAnswer(answer, CreatedBy);
            question.AddAnswer(Substitute.For<RankingTextAnswer>(), CreatedBy);
            question.AddAnswer(Substitute.For<RankingTextAnswer>(), CreatedBy);

            //Act
            var result = _controller.DeleteAnswer(question, answer);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region UpdateAnswerText

        [TestMethod]
        public void UpdateAnswerText_ShouldReturnBadRequest_WhenAnswerIsNull()
        {
            //Act
            var result = _controller.UpdateAnswerText(null, "text");

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void UpdateAnswerText_ShouldReturnBadRequest_WhenKeyIsNull()
        {
            //Act
            var result = _controller.UpdateAnswerText(Substitute.For<RankingTextAnswer>(), null);

            //Assert
            result.Should().BeBadRequestResult();
        }

        [TestMethod]
        public void UpdateAnswerText_ShouldChangeAnswerText()
        {
            //Arrange
            var answer = Substitute.For<RankingTextAnswer>();
            const string text = "text";

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            _controller.UpdateAnswerText(answer, text);

            //Assert
            answer.Received().UpdateText(text, username);
        }

        #endregion

        #region UpdateOrder

        [TestMethod]
        public void UpdateOrder_ShouldReturnHttpNotFoundResult_WhenQuestionIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateOrder(null, new Collection<RankingTextAnswer>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void UpdateOrder_ShouldCallUpdateAnswersForQuestion()
        {
            //Arrange
            var question = Substitute.For<RankingText>();
            var answers = new Collection<RankingTextAnswer>();

            const string username = "username";
            _user.Identity.Name.Returns(username);
            
            //Act
            _controller.UpdateOrder(question, answers);

            //Assert
            question.Received().UpdateAnswersOrder(answers, username);
        }

        [TestMethod]
        public void UpdateLearningContentsOrder_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var question = Substitute.For<RankingText>();
            var answers = new Collection<RankingTextAnswer>();

            const string username = "username";
            _user.Identity.Name.Returns(username);

            //Act
            var result = _controller.UpdateOrder(question, answers);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion
    }
}
