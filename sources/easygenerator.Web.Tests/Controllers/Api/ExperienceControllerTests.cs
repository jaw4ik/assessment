using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;
using easygenerator.Web.BuildExperience.PackageModel;
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
        ExperienceController _controller;
        IExperienceBuilder _builder;
        PackageModelMapper _packageModelMapper;
        IEntityFactory _entityFactory;
        IExperienceRepository _repository;

        [TestInitialize]
        public void InitializeContext()
        {
            _entityFactory = Substitute.For<IEntityFactory>();
            _repository = Substitute.For<IExperienceRepository>();
            _builder = Substitute.For<IExperienceBuilder>();
            _packageModelMapper = Substitute.For<PackageModelMapper>();
            _controller = new ExperienceController(_builder, _packageModelMapper, _repository, _entityFactory);
        }

        #region Create experience

        [TestMethod]
        public void Create_ShouldReturnJsonSuccessResult()
        {
            const string title = "title";
            var experience = ExperienceObjectMother.CreateWithTitle(title);
            var template = TemplateObjectMother.Create();
            _entityFactory.Experience(title, template).Returns(experience);

            var result = _controller.Create(title, template);

            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void Create_ShouldAddExperience()
        {
            const string title = "title";
            var experience = ExperienceObjectMother.CreateWithTitle(title);
            var template = TemplateObjectMother.Create();
            _entityFactory.Experience(title, template).Returns(experience);

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
        public void Build_ShouldReturnJson()
        {
            //Arrange
            var viewModel = new ExperienceBuildModel();

            //Act
            var result = _controller.Build(viewModel);

            //Assert
            ActionResultAssert.IsJsonResult(result);
        }

        [TestMethod]
        public void Build_ShouldReturnBadRequest_WhenViewModelIsNull()
        {
            //Arrange

            //Act
            var result = _controller.Build(null);

            //Assert
            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        [TestMethod]
        public void Build_ShouldReturnBadRequest_WhenModelIsNotValid()
        {
            //Arrange
            var viewModel = new ExperienceBuildModel();

            //Act
            _controller.AddRandomModelStateError();
            var result = _controller.Build(viewModel);

            //Assert
            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        [TestMethod]
        public void Build_ShouldCreatePackageModel()
        {
            //Arrange
            var viewModel = new ExperienceBuildModel();

            //Act
            _controller.Build(viewModel);

            //Assert
            _packageModelMapper.Received().MapExperienceBuildModel(Arg.Any<ExperienceBuildModel>());
        }

        [TestMethod]
        public void Build_ShouldReturnSuccessBuildResultWhenBuildSucceed()
        {
            //Arrange
            var viewModel = new ExperienceBuildModel();
            var packageModel = new ExperiencePackageModel();

            _packageModelMapper.MapExperienceBuildModel(Arg.Any<ExperienceBuildModel>())
                .Returns(packageModel);

            _builder.Build(Arg.Any<ExperiencePackageModel>())
                .Returns(new BuildResult() { Success = true, PackageUrl = "" });

            //Act
            var result = _controller.Build(viewModel);

            //Assert
            var json = result as JsonResult;
            Assert.IsNotNull(json);
            var buildResult = json.Data as BuildResult;
            Assert.IsNotNull(buildResult);
            Assert.IsTrue(buildResult.Success);
        }

        [TestMethod]
        public void Build_ShouldReturnFailedBuildResultWhenBuildIsNotSucceed()
        {
            //Arrange
            var viewModel = new ExperienceBuildModel();
            var packageModel = new ExperiencePackageModel();

            _packageModelMapper.MapExperienceBuildModel(Arg.Any<ExperienceBuildModel>())
                .Returns(packageModel);

            _builder.Build(Arg.Any<ExperiencePackageModel>())
                .Returns(new BuildResult() { Success = false, PackageUrl = "" });

            //Act
            var result = _controller.Build(viewModel);

            //Assert
            var json = result as JsonResult;
            Assert.IsNotNull(json);
            var buildResult = json.Data as BuildResult;
            Assert.IsNotNull(buildResult);
            Assert.IsFalse(buildResult.Success);
        }

        #endregion

        #region GetCollection

        [TestMethod]
        public void GetCollection_ShouldReturnJsonSuccessResult()
        {
            var collection = new Collection<Experience>(new List<Experience>() { ExperienceObjectMother.Create() });

            _repository.GetCollection().Returns(collection);

            var result = _controller.GetCollection();

            result.Should().BeJsonSuccessResult().And.Data.Should().Be(collection);
        }

        #endregion

        #region Update Title

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult_WhenExperienceIsNull()
        {
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            var result = _controller.UpdateTitle(null, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = DateTime.MaxValue });
        }

        [TestMethod]
        public void Update_ShouldUpdateExperienceTitle()
        {
            const string title = "updated title";
            var experience = Substitute.For<Experience>();

            _controller.UpdateTitle(experience, title);

            experience.Received().UpdateTitle(title);
        }

        [TestMethod]
        public void Update_ShouldReturnJsonSuccessResult()
        {
            var experience = Substitute.For<Experience>();

            var result = _controller.UpdateTitle(experience, String.Empty);

            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = experience.ModifiedOn });
        }


        #endregion

        #region Update Template

        [TestMethod]
        public void UpdateTemplate_ShouldReturnJsonSuccessResult_WhenQuestionIsNull()
        {
            //Arrange
            var template = Substitute.For<Template>();
            DateTimeWrapper.Now = () => DateTime.MaxValue;

            //Act
            var result = _controller.UpdateTemplate(null, template);

            //Assert
            result.Should().BeJsonSuccessResult().And.Data.ShouldBeSimilar(new { ModifiedOn = DateTime.MaxValue });
        }


        [TestMethod]
        public void UpdateTemplate_ShouldUpdateExperienceTemplate()
        {
            //Arrange
            var experience = Substitute.For<Experience>();
            var template = Substitute.For<Template>();

            //Act
            _controller.UpdateTemplate(experience, template);

            //Assert
            experience.Received().UpdateTemplate(template);
        }

        [TestMethod]
        public void UpdateTemplate_ShouldReturnJsonSuccessResult()
        {
            //Arrange
            var experience = Substitute.For<Experience>();
            var template = Substitute.For<Template>();

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
            var experience = Substitute.For<Experience>("title", TemplateObjectMother.Create());
            var objective = ObjectiveObjectMother.Create();

            //Act
            _controller.RelateObjectives(experience, new List<Objective>() { objective });

            //Assert
            experience.Received().RelateObjective(objective);
        }

        [TestMethod]
        public void RelateObjectives_ShouldReturnJsonSuccessResult_WhenExperienceIsNull()
        {
            //Arrange
            var experience = ExperienceObjectMother.Create();
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.RelateObjectives(null, new List<Objective>() { objective });

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
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
            ActionResultAssert.IsBadRequestStatusCodeResult(result);
        }

        #endregion

        #region Unrelate Objectives

        [TestMethod]
        public void UnrelateObjectives_ShouldReturnJson()
        {
            //Arrange
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
            var objective = ObjectiveObjectMother.Create();
            var experience = Substitute.For<Experience>("title", TemplateObjectMother.Create());

            //Act
            _controller.UnrelateObjectives(experience, new List<Objective>() { objective });

            //Assert
            experience.Received().UnrelateObjective(objective);
        }

        [TestMethod]
        public void UnrelateObjectives_ShouldReturnJsonSuccessResult_WhenExperienceIsNull()
        {
            //Arrange
            var objective = ObjectiveObjectMother.Create();

            //Act
            var result = _controller.UnrelateObjectives(null, new List<Objective>() { objective });

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
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
