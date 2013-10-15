using System;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class LearningObjectControllerTests
    {
        IPrincipal _user;
        HttpContextBase _context;
        IEntityFactory _entityFactory;

        LearningObjectController _controller;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new LearningObjectController(_entityFactory);
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
        public void Create_ShouldAddLearningObjectToQuestion()
        {
            const string text = "text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);

            var question = Substitute.For<Question>();
            var learningObject = Substitute.For<LearningObject>();

            _entityFactory.LearningObject(text, user).Returns(learningObject);

            _controller.Create(question, text);

            question.Received().AddLearningObject(learningObject, user);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string text = "text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var learningObject = Substitute.For<LearningObject>();

            _entityFactory.LearningObject(text, user).Returns(learningObject);

            var result = _controller.Create(Substitute.For<Question>(), text);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = learningObject.Id.ToString("N"), CreatedOn = learningObject.CreatedOn });
        }

        #endregion

        #region Delete question

        [TestMethod]
        public void Delete_ShouldReturnJsonErrorResult_WnenQuestionIsNull()
        {
            var result = _controller.Delete(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Question is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("questionNotFoundError");  
        }

        [TestMethod]
        public void Delete_ShouldRemoveLearningObjectFromQuestion()
        {
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var question = Substitute.For<Question>();
            var learningObject = Substitute.For<LearningObject>();

            _controller.Delete(question, learningObject);

            question.Received().RemoveLearningObject(learningObject, user);
        }

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var question = Substitute.For<Question>();

            var result = _controller.Delete(question, Substitute.For<LearningObject>());

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { ModifiedOn = question.ModifiedOn });
        }

        #endregion

        #region Update text

        [TestMethod]
        public void UpdateText_ShouldReturnJsonErrorResult_WhenLearningObjectIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateText(null, null);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Learning Object is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("learningObjectNotFoundError");  
        }


        [TestMethod]
        public void UpdateText_ShouldUpdateLearningObjectText()
        {
            const string text = "updated text";
            const string user = "username@easygenerator.com";
            _user.Identity.Name.Returns(user);
            var learningObject = Substitute.For<LearningObject>();

            _controller.UpdateText(learningObject, text);

            learningObject.Received().UpdateText(text, user);
        }

        [TestMethod]
        public void UpdateText_ShouldReturnJsonSuccessResult()
        {
            var learningObject = Substitute.For<LearningObject>();

            var result = _controller.UpdateText(learningObject, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = learningObject.ModifiedOn });
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
            result.Should().BeJsonErrorResult().And.Message.Should().Be(Constants.Errors.QuestionNotFoundError);
        }

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var question = QuestionObjectMother.Create();
            question.AddLearningObject(LearningObjectObjectMother.Create(), "Some user");

            //Act
            var result = _controller.GetCollection(question);

            //Assert
            result.Should().BeJsonSuccessResult();
        }

        #endregion
    }
}
