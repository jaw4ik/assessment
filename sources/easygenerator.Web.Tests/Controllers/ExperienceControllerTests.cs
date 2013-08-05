using System.Collections.Generic;
using System.Web.Mvc;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.BuildModel;
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

        [TestInitialize]
        public void InitializeContext()
        {
            _builder = new Mock<IExperienceBuilder>();
            _controller = new ExperienceController(_builder.Object);
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
            Assert.IsInstanceOfType(result, typeof(JsonResult));
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
        public void Build_ShouldReturnSuccessBuildResultWhenBuildSucceed()
        {
            //Arrange
            var viewModel = new ExperienceBuildModel();
            _builder.Setup(item => item.Build(viewModel)).Returns(true);

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
            _builder.Setup(item => item.Build(viewModel)).Returns(false);

            //Act
            var result = _controller.Build(viewModel);

            //Assert
            var json = result as JsonResult;
            Assert.IsNotNull(json);
            var buildResult = json.Data as BuildResult;
            Assert.IsNotNull(buildResult);
            Assert.IsFalse(buildResult.Success);
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

        #endregion
    }
}
