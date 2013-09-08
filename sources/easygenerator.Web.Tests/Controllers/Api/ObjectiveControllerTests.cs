using System;
using System.Runtime.InteropServices;
using System.ServiceModel.Configuration;
using System.Web.Razor.Parser.SyntaxTree;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using easygenerator.Web.ViewModels.Objective;
using FluentAssertions;
using FluentAssertions.Primitives;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class ObjectiveControllerTests
    {
        private ObjectiveController _controller;

        IEntityFactory _entityFactory;
        IObjectiveRepository _repository;


        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _repository = Substitute.For<IObjectiveRepository>();
            _controller = new ObjectiveController(_repository, _entityFactory);
        }

        #region Create objective

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            var objective = ObjectiveObjectMother.Create();
            _entityFactory.Objective(null).ReturnsForAnyArgs(objective);

            var result = _controller.Create(null);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = objective.Id.ToString("N"), CreatedOn = objective.CreatedOn });
        }

        [TestMethod]
        public void Create_ShouldAddObjective()
        {
            //Arrange
            const string title = "title";
            var objective = ObjectiveObjectMother.CreateWithTitle(title);
            _entityFactory.Objective(title).Returns(objective);

            //Act
            _controller.Create(title);

            //Assert
            _repository.Received().Add(Arg.Is<Objective>(obj => obj.Title == title));
        }


        #endregion


        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult();
        }

        #endregion

    }
}
