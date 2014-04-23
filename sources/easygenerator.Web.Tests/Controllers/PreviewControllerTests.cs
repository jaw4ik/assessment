using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Controllers;
using easygenerator.Web.Preview;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Net;
using System.Threading.Tasks;

namespace easygenerator.Web.Tests.Controllers
{
    [TestClass]
    public class PreviewControllerTests
    {
        private PreviewController _controller;
        private ICoursePreviewBuilder _coursePreviewBuilder;
        private BuildPathProvider _pathProvider;
        private IUrlHelperWrapper _urlHelper;
        private PhysicalFileManager _physicalFileManager;

        [TestInitialize]
        public void Initialize()
        {
            _coursePreviewBuilder = Substitute.For<ICoursePreviewBuilder>();
            _pathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _urlHelper = Substitute.For<IUrlHelperWrapper>();
            _physicalFileManager = Substitute.For<PhysicalFileManager>();

            _controller = new PreviewController(_coursePreviewBuilder, _pathProvider, _urlHelper, _physicalFileManager);
        }

        #region PreviewCourse

        [TestMethod]
        public void PreviewCourse_ShouldReturnNotFound_WhenCourseIsNull()
        {
            //Arrange

            //Act
            var result = _controller.PreviewCourse(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void PeviewCourse_ShouldSetViewBagUrl()
        {
            //arrange
            var course = CourseObjectMother.Create();
            const string url = "url";
            _urlHelper.ToAbsoluteUrl(Arg.Any<string>()).Returns(url);

            //Act
            _controller.PreviewCourse(course);

            //Assert
            Assert.AreEqual(_controller.ViewBag.Url, url);
        }

        [TestMethod]
        public void PeviewCourse_ShouldReturnView()
        {
            //arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _controller.PreviewCourse(course);

            //Assert
            result.Should().BeViewResult();
        }

        #endregion

        #region BuildCoursePreview

        [TestMethod]
        public async Task BuildCoursePreview_ShouldReturnNotFound_WhenCourseIsNull()
        {
            //Arrange

            //Act
            var result = await _controller.BuildCoursePreview(null);

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void BuildCoursePreview_ShouldBuildCourseForPreview()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
             _controller.BuildCoursePreview(course);

            //Assert
            _coursePreviewBuilder.Received().Build(course);
        }

        [TestMethod]
        public async Task BuildCoursePreview_ShouldReturnServerError_WhenCourseIsFailedToBuild()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _coursePreviewBuilder.Build(course).Returns(Task.FromResult(false));

            //Act
            var result = await _controller.BuildCoursePreview(course);

            //Assert
            result.Should().BeHttpStatusCodeResultWithStatus((int)HttpStatusCode.InternalServerError);
        }

        [TestMethod]
        public async Task BuildCoursePreview_ShouldReturnJson_WhenCourseIsSucceedToBuild()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _coursePreviewBuilder.Build(course).Returns(Task.FromResult(true));
            const string url = "url";
            _urlHelper.ToAbsoluteUrl(Arg.Any<string>()).Returns(url);

            //Act
            var result = await _controller.BuildCoursePreview(course);

            //Assert
            result.Should().BeJsonResultWithData(url);
        }

        #endregion

        #region GetPreviewResource

        [TestMethod]
        public void GetPreviewResource_ShouldReturnHttpNotFoundCodeResult_WhenResourceDoesNotExist()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(false);

            //Act
            var result = _controller.GetPreviewResource("courseId", "resourceId");

            //Assert
            result.Should().BeHttpNotFoundResult();
        }

        [TestMethod]
        public void GetPreviewResource_ShouldReturnFilePathResult_WhenResourceExists()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);
            _pathProvider.GetPreviewResourcePath(Arg.Any<string>()).Returns("filePath");

            //Act
            var result = _controller.GetPreviewResource("courseId", "resourceId");

            //Assert
            result.Should().BeFilePathResult();
        }

        [TestMethod]
        public void GetPreviewResource_ShouldGetResource_WhenResourceIsCalled()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);
            _pathProvider.GetPreviewResourcePath(Arg.Any<string>()).Returns("filePath");

            //Act
            _controller.GetPreviewResource("courseId", "resourceId");

            //Assert
            _pathProvider.Received().GetPreviewResourcePath("courseId\\resourceId");
        }

        [TestMethod]
        public void GetPreviewResource_ShouldGetStartPage_WhenResourceIsNotCalled()
        {
            //Arrange
            _physicalFileManager.FileExists(Arg.Any<string>()).Returns(true);
            _pathProvider.GetPreviewResourcePath(Arg.Any<string>()).Returns("filePath");

            //Act
            _controller.GetPreviewResource("courseId", " ");

            //Assert
            _pathProvider.Received().GetPreviewResourcePath("courseId\\index.html");
        }

        #endregion
    }
}
