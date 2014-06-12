﻿using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.ObjectiveEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Mappers;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Extensions;
using easygenerator.Web.Permissions;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class ObjectiveControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";
        private const string ModifiedBy = "easygenerator2@easygenerator.com";

        private ObjectiveController _controller;

        IEntityFactory _entityFactory;
        IObjectiveRepository _repository;
        IPrincipal _user;
        HttpContextBase _context;
        IEntityMapper _entityMapper;
        private IEntityPermissionsChecker<Objective> _entityPermissionChecker;
        private IDomainEventPublisher _eventPublisher;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _repository = Substitute.For<IObjectiveRepository>();
            _entityMapper = Substitute.For<IEntityMapper>();
            _entityPermissionChecker = Substitute.For<IEntityPermissionsChecker<Objective>>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _controller = new ObjectiveController(_repository, _entityFactory, _entityMapper, _entityPermissionChecker, _eventPublisher);

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var collection = new Collection<Objective>(new List<Objective>() { ObjectiveObjectMother.Create() });

            _repository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult();
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
                .And.Data.ShouldBeSimilar(new { Id = objective.Id.ToNString(), CreatedOn = objective.CreatedOn });
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
        public void Update_ShouldReturnJsonErrorResult_WhenObjectiveIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.Update(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveNotFoundError");
        }


        [TestMethod]
        public void Update_ShouldUpdateObjectiveTitle()
        {
            const string title = "updated title";
            _user.Identity.Name.Returns(ModifiedBy);
            var objective = Substitute.For<Objective>("Some title", CreatedBy);

            _controller.Update(objective, title);

            objective.Received().UpdateTitle(title, ModifiedBy);
        }

        [TestMethod]
        public void Update_ShouldPublishDomainEvent()
        {
            const string title = "updated title";
            _user.Identity.Name.Returns(ModifiedBy);
            var objective = Substitute.For<Objective>("Some title", CreatedBy);

            _controller.Update(objective, title);

            _eventPublisher.Received().Publish(Arg.Any<ObjectiveTitleUpdatedEvent>());
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
            var objective = Substitute.For<Objective>("Some title", CreatedBy);

            var result = _controller.Delete(objective);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveObjective_WhenItNotNull()
        {
            var objective = Substitute.For<Objective>("Some title", CreatedBy);

            _controller.Delete(objective);

            _repository.Received().Remove(objective);
        }

        [TestMethod]
        public void Delete_ReturnJsonSuccessResult_WhenObjectiveIsNull()
        {
            var result = _controller.Delete(null);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ReturnJsonErrorResult_WhenObjectiveIsInCourse()
        {
            var course = Substitute.For<Course>();
            var courses = new List<Course>() { course };

            var objective = Substitute.For<Objective>("Some title", CreatedBy);
            objective.Courses.Returns(courses);

            var result = _controller.Delete(objective);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objective can not be deleted");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectiveCannnotBeDeleted");
        }

        #endregion

        #region UpdateQuestionsOrder

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldReturnHttpNotFoundResult_WhenObjectiveIsNull()
        {
            //Arrange

            //Act
            var result = _controller.UpdateQuestionsOrder(null, new Collection<Question>());

            //Assert
            result.Should().BeHttpNotFoundResult().And.StatusDescription.Should().Be(Errors.ObjectiveNotFoundError);
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldCallUpdateQuestionsForObjective()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var questions = new Collection<Question>();
            _user.Identity.Name.Returns(ModifiedBy);

            //Act
            _controller.UpdateQuestionsOrder(objective, questions);

            //Assert
            objective.Received().UpdateQuestionsOrder(questions, ModifiedBy);
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldPublishDomainEvent()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var questions = new Collection<Question>();
            _user.Identity.Name.Returns(ModifiedBy);

            //Act
            _controller.UpdateQuestionsOrder(objective, questions);

            //Assert
            _eventPublisher.Received().Publish(Arg.Any<QuestionsReorderedEvent>());
        }

        [TestMethod]
        public void UpdateQuestionsOrder_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var objective = Substitute.For<Objective>();
            var questions = new Collection<Question>();
            _user.Identity.Name.Returns(ModifiedBy);

            //Act
            var result = _controller.UpdateQuestionsOrder(objective, questions);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = objective.ModifiedOn });
        }

        #endregion
    }
}
