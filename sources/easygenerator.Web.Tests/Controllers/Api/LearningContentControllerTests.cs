using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Questions;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.LearningContentEvents;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class LearningContentControllerTests
    {
        IPrincipal _user;
        HttpContextBase _context;
        IEntityFactory _entityFactory;

        LearningContentController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new LearningContentController(_entityFactory);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create

        [TestMethod]
        public void Create_ShouldReturnJsonErrorResult_WnenQuestionIsNull()
        {
            const string text = "text";
            var result = _controller.Create(null, text);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");
        }

        [TestMethod]
        public void Create_ShouldAddLearningContentToQuestion()
        {
            const string text = "text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);

            var question = Substitute.For<Question>();
            var learningContent = Substitute.For<LearningContent>();

            _entityFactory.LearningContent(text, user).Returns(learningContent);

            _controller.Create(question, text);

            question.Received().AddLearningContent(learningContent, user);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string text = "text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var learningContent = Substitute.For<LearningContent>();

            _entityFactory.LearningContent(text, user).Returns(learningContent);

            var result = _controller.Create(Substitute.For<Question>(), text);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = learningContent.Id.ToNString(), CreatedOn = learningContent.CreatedOn });
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
        public void Delete_ShouldReturnJsonSuccessResult_WnenLearningContentIsNull()
        {
            var question = Substitute.For<Question>();

            var result = _controller.Delete(question, null);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveLearningContentFromQuestion()
        {
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>();
            var learningContent = Substitute.For<LearningContent>();

            _controller.Delete(question, learningContent);

            question.Received().RemoveLearningContent(learningContent, user);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResultWithModifiedOnDate()
        {
            var question = Substitute.For<Question>();

            var result = _controller.Delete(question, Substitute.For<LearningContent>());

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Update text

        [TestMethod]
        public void UpdateText_ShouldReturnJsonErrorResult_WhenLearningContentIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateText(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Learning Content is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("learningContentNotFoundError");
        }


        [TestMethod]
        public void UpdateText_ShouldUpdateLearningContentText()
        {
            const string text = "updated text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var learningContent = Substitute.For<LearningContent>();

            _controller.UpdateText(learningContent, text);

            learningContent.Received().UpdateText(text, user);
        }

        [TestMethod]
        public void UpdateText_ShouldReturnJsonSuccessResult()
        {
            var learningContent = Substitute.For<LearningContent>();

            var result = _controller.UpdateText(learningContent, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = learningContent.ModifiedOn });
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
            question.AddLearningContent(LearningContentObjectMother.Create(), "Some user");

            //Act
            var result = _controller.GetCollection(question);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
