using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
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
            //Arrange
            const string title = "title";
            var experience = ExperienceObjectMother.CreateWithTitle(title);
            _entityFactory.Experience(title).Returns(experience);

            //Act
            var result = _controller.Create(title);

            //Assert
            ActionResultAssert.IsJsonSuccessResult(result);
        }

        [TestMethod]
        public void Create_ShouldAddExperience()
        {
            //Arrange
            const string title = "title";
            var experience = ExperienceObjectMother.CreateWithTitle(title);
            _entityFactory.Experience(title).Returns(experience);

            //Act
            _controller.Create(title);

            //Assert
            _repository.Received().Add(Arg.Is<Experience>(exp => exp.Title == title));
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
    }
}
