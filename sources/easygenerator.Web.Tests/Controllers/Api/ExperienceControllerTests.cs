using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Controllers.Api;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Controllers.Api
{
    [TestClass]
    public class ExperienceControllerTests
    {
        private const string CreatedBy = "easygenerator@easygenerator.com";

        ExperienceController _controller;
        IExperienceBuilder _builder;
        IEntityFactory _entityFactory;
        IExperienceRepository _repository;
        IPrincipal _user;
        HttpContextBase _context;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _repository = Substitute.For<IExperienceRepository>();
            _builder = Substitute.For<IExperienceBuilder>();

            _user = Substitute.For<IPrincipal>();
            _context = Substitute.For<HttpContextBase>();
            _context.User.Returns(_user);

            _controller = new ExperienceController(_builder, _repository, _entityFactory);
            _controller.ControllerContext = new ControllerContext(_context, new RouteData(), _controller);
        }

        #region Create experience

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var experience = ExperienceObjectMother.CreateWithTitle(title);
            var template = TemplateObjectMother.Create();
            _entityFactory.Experience(title, template, user).Returns(experience);

            var result = _controller.Create(title, template);

            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void Create_ShouldAddExperience()
        {
            const string title = "title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var experience = ExperienceObjectMother.CreateWithTitle(title);
            var template = TemplateObjectMother.Create();
            _entityFactory.Experience(title, template, user).Returns(experience);

            _controller.Create(title, template);

            _repository.Received().Add(Arg.Is<Experience>(exp => exp.Title == title));
        }

        #endregion

        #region Delete experience

        [TestMethod]
        public void Delete_ShouldReturnJsonSuccessResult()
        {
            var experience = ExperienceObjectMother.Create();

            var result = _controller.Delete(experience);

            result.Should().BeJsonSuccessResult();
        }

        [TestMethod]
        public void Delete_ShouldRemoveExperience()
        {
            var experience = ExperienceObjectMother.Create();

            _controller.Delete(experience);

            _repository.Received().Remove(experience);
        }

        #endregion

        #region Build experience

        [TestMethod]
        public void Build_ShouldReturnJsonErrorResult_WhenExperienceNotFound()
        {
            //Arrange


            //Act
            var result = _controller.Build(null);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Experience is not found");
        }

        [TestMethod]
        public void Build_ShouldReturnJsonErrorResult_WhenBuildFails()
        {
            //Arrange
            _builder.Build(Arg.Any<Experience>()).Returns(false);

            //Act
            var result = _controller.Build(ExperienceObjectMother.Create());

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Build failed");
        }

        [TestMethod]
        public void Build_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();
            _builder.Build(experience).Returns(true);
            _builder.When(x => x.Build(experience)).Do(x => ((Experience)x.Args()[0]).UpdatePackageUrl("Some url"));

            //Act
            var result = _controller.Build(experience);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { PackageUrl = experience.PackageUrl, BuildOn = experience.BuildOn });
        }

        #endregion

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var collection = new Collection<Experience>(new List<Experience>() { ExperienceObjectMother.Create() });

            _repository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult();
        }

        #endregion

        #region Update Title

        [TestMethod]
        public void Update_ShouldReturnJsonErrorResult_WhenExperienceIsNull()
        {
            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonErrorResult().And.Message.Should().Be("Experience is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("experienceNotFoundError");  
        }

        [TestMethod]
        public void Update_ShouldUpdateExperienceTitle()
        {
            const string title = "updated title";
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var experience = Substitute.For<Experience>("Some title", TemplateObjectMother.Create(), CreatedBy);

            _controller.UpdateTitle(experience, title);

            experience.Received().UpdateTitle(title, user);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var experience = Substitute.For<Experience>("Some title", TemplateObjectMother.Create(), CreatedBy);

            var result = _controller.UpdateTitle(experience, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = experience.ModifiedOn });
        }


        #endregion

        #region Update Template

        [TestMethod]
        public void UpdateTemplate_ShouldReturnJsonErrorResult_WhenExperienceIsNull()
        {
            //Arrange
            var template = TemplateObjectMother.Create();

            //Act
            var result = _controller.UpdateTemplate(null, template);

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Experience is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("experienceNotFoundError"); 
        }


        [TestMethod]
        public void UpdateTemplate_ShouldUpdateExperienceTemplate()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var experience = Substitute.For<Experience>("Some title", TemplateObjectMother.Create(), CreatedBy);
            var template = TemplateObjectMother.Create();

            //Act
            _controller.UpdateTemplate(experience, template);

            //Assert
            experience.Received().UpdateTemplate(template, user);
        }

        [TestMethod]
        public void UpdateTemplate_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var experience = Substitute.For<Experience>("Some title", TemplateObjectMother.Create(), CreatedBy);
            var template = TemplateObjectMother.Create();

            //Act
            var result = _controller.UpdateTemplate(experience, template);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = experience.ModifiedOn });
        }

        #endregion

        #region Relate Objectives

        [TestMethod]
        public void RelateObjectives_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns("Test user");
            var experience = ExperienceObjectMother.Create();
            var relatedObjectives = new List<Objective>() { ObjectiveObjectMother.Create() };

            //Act
            var result = _controller.RelateObjectives(experience, relatedObjectives);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void RelateObjectives_ShouldRelateObjectiveToExperience()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var experience = Substitute.For<Experience>("title", TemplateObjectMother.Create(), CreatedBy);
            var objective = ObjectiveObjectMother.Create();

            //Act
            _controller.RelateObjectives(experience, new List<Objective>() { objective });

            //Assert
            experience.Received().RelateObjective(objective, user);
        }

        [TestMethod]
        public void RelateObjectives_ShouldReturnJsonErrorResult_WhenExperienceIsNull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.RelateObjectives(null, new List<Objective>() { objective });

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Experience is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("experienceNotFoundError");  
        }

        [TestMethod]
        public void RelateObjectives_ShouldReturnBadRequest_WhenObjectiveListIsEmpty()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.RelateObjectives(experience, new List<Objective>() { });

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Objectives are not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("objectivesNotFoundError");  
        }

        #endregion

        #region Unrelate Objectives

        [TestMethod]
        public void UnrelateObjectives_ShouldReturnJson()
        {
            //Arrange
            _user.Identity.Name.Returns("Test user");
            var experience = ExperienceObjectMother.Create();
            var relatedObjectives = new List<Objective>() { ObjectiveObjectMother.Create() };

            //Act
            var result = _controller.UnrelateObjectives(experience, relatedObjectives);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void UnrelateObjectives_ShouldUnrelateObjectiveFromExperience()
        {
            //Arrange
            var user = "Test user";
            _user.Identity.Name.Returns(user);
            var objective = ObjectiveObjectMother.Create();
            var experience = Substitute.For<Experience>("title", TemplateObjectMother.Create(), CreatedBy);

            //Act
            _controller.UnrelateObjectives(experience, new List<Objective>() { objective });

            //Assert
            experience.Received().UnrelateObjective(objective, user);
        }

        [TestMethod]
        public void UnrelateObjectives_ShouldReturnJsonErrorResult_WhenExperienceIsNull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.UnrelateObjectives(null, new List<Objective>() { objective });

            //Assert
            result.Should().BeJsonErrorResult().And.Message.Should().Be("Experience is not found");
            result.Should().BeJsonErrorResult().And.ResourceKey.Should().Be("experienceNotFoundError");  
        }

        [TestMethod]
        public void UnrelateObjectives_ShouldReturnBadRequest_WhenObjectiveListIsEmpty()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();

            //Act
            var result = _controller.UnrelateObjectives(experience, new List<Objective>() { });

            //Assert
            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        #endregion
    }
}
