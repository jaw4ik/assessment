using System.Web.Mvc;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;
using easygenerator.Web.BuildExperience.PackageModel;
using easygenerator.Web.Controllers;
using easygenerator.Web.Tests.Utils;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class ExperienceControllerTests
    {
        private ExperienceController _controller;
        private Mock<IExperienceBuilder> _builder;
        private Mock<PackageModelMapper> _packageModelMapperMock;

        [TestInitialize]
        public void InitializeContext()
        {
            _builder = new Mock<IExperienceBuilder>();
            _packageModelMapperMock = new Mock<PackageModelMapper>();
            _controller = new ExperienceController(_builder.Object, _packageModelMapperMock.Object);
        }

        #region Build

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
            _packageModelMapperMock.Setup(item => item.MapExperienceBuildModel(It.IsAny<ExperienceBuildModel>()));

            //Act
            _controller.Build(viewModel);

            //Assert
            _packageModelMapperMock.Verify(item => item.MapExperienceBuildModel(viewModel));
        }

        [TestMethod]
        public void Build_ShouldReturnSuccessBuildResultWhenBuildSucceed()
        {
            //Arrange
            var viewModel = new ExperienceBuildModel();
            var packageModel = new ExperiencePackageModel();
            _packageModelMapperMock.Setup(item => item.MapExperienceBuildModel(It.IsAny<ExperienceBuildModel>())).Returns(packageModel);
            _builder.Setup(item => item.Build(It.IsAny<ExperiencePackageModel>())).Returns(true);

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
            _packageModelMapperMock.Setup(item => item.MapExperienceBuildModel(It.IsAny<ExperienceBuildModel>())).Returns(packageModel);
            _builder.Setup(item => item.Build(It.IsAny<ExperiencePackageModel>())).Returns(false);

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
    }
}
