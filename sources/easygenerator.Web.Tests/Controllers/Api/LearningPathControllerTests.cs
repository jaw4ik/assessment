using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class LearningPathControllerTests
    {
        private const string Username = "easygenerator@easygenerator.com";
        private const string Title = "easygenerator@easygenerator.com";

        private LearningPathController _controller;

        private ILearningPathRepository _repository;
        private IEntityModelMapper<LearningPath> _mapper;
        private IEntityFactory _entityFactory;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _mapper = Substitute.For<IEntityModelMapper<LearningPath>>();
            _repository = Substitute.For<ILearningPathRepository>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new LearningPathController(_repository, _mapper, _entityFactory);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create

        [TestMethod]
        public void Create_ShouldAddLearningPathToRepository()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);

            var learningPath = LearningPathObjectMother.CreateWithTitle(Title);
            _entityFactory.LearningPath(Title, Username).Returns(learningPath);

            //Act
            _controller.Create(Title);

            //Assert
            _repository.Received().Add(learningPath);
        }

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            _user.Identity.Name.Returns(Username);

            var learningPath = LearningPathObjectMother.CreateWithTitle(Title);
            _entityFactory.LearningPath(Title, Username).Returns(learningPath);

            //Act
            var result = _controller.Create(Title);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().NotBeNull();
        }

        #endregion

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var learningPath1 = LearningPathObjectMother.Create();
            var learningPath2 = LearningPathObjectMother.Create();
            var learningPaths = new[] { learningPath1, learningPath2 };
            _repository.GetCollection().ReturnsForAnyArgs(learningPaths);
            _mapper.Map(learningPath1).Returns(learningPath1);
            _mapper.Map(learningPath2).Returns(learningPath2);

            //Act
            var result = _controller.GetCollection();

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.Should().NotBeNull();
        }

        #endregion

    }
}
