using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Security.Principal;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MvcContrib.TestHelper;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class ObjectiveControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        private ObjectiveController _controller;

        IEntityFactory _entityFactory;
        IObjectiveRepository _repository;
        IPrincipal _user;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _repository = Substitute.For<IObjectiveRepository>();
            _controller = new ObjectiveController(_repository, _entityFactory);

            // http://mvccontrib.codeplex.com/documentation >> Test Helper
            _controller = new TestControllerBuilder().CreateController<ObjectiveController>(_repository, _entityFactory);

            _user = Substitute.For<IPrincipal>();
            _controller.HttpContext.User = _user;
        }

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var collection = new Collection<Objective>(new List<Objective>() { ObjectiveObjectMother.Create() });

            _repository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult().And.Data.Should().Be(collection);
        }

        #endregion

        #region Create objective

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            var objective = ObjectiveObjectMother.Create();
            _entityFactory.Objective(null, CreatedBy).ReturnsForAnyArgs(objective);

            var result = _controller.Create(null);

            result.Should()
                .BeJsonSuccessResult()
                .And.Data.ShouldBeSimilar(new { Id = objective.Id.ToString("N"), CreatedOn = objective.CreatedOn });
        }

        [TestMethod]
        public void Create_ShouldAddObjective()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = ObjectiveObjectMother.CreateWithTitle(title);
            _entityFactory.Objective(title, user).Returns(objective);

            _controller.Create(title);

            _repository.Received().Add(Arg.Is<Objective>(obj => obj.Title == title));
        }


        #endregion

        #region Update objective

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult_WhenObjectiveIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.Update(null, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = DateTime.MaxValue });
        }


        [TestMethod]
        public void Update_ShouldUpdateObjectiveTitle()
        {
            const string title = "updated title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = Substitute.For<Objective>("Some title", CreatedBy);

            _controller.Update(objective, title);

            objective.Received().UpdateTitle(title, user);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var objective = Substitute.For<Objective>("Some title", CreatedBy);

            var result = _controller.Update(objective, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = objective.ModifiedOn });
        }

        #endregion


        #region Delete objective

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var objective = ObjectiveObjectMother.Create();

            var result = _controller.Delete(objective);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveObjective()
        {
            var objective = ObjectiveObjectMother.Create();

            _controller.Delete(objective);

            _repository.Received().Remove(objective);
        }


        #endregion
    }
}
