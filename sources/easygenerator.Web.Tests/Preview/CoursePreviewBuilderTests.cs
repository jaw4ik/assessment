using System;
using System.Threading.Tasks;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Preview;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Preview
{
    [TestClass]
    public class CoursePreviewBuilderTests
    {
        private CoursePreviewBuilder _previewBuilder;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _buildPathProvider;
        private BuildContentProvider _contentProvider;
        private ILog _logger;

        [TestInitialize]
        public void InitializeContext()
        {
            _logger = Substitute.For<ILog>();
            _fileManager = Substitute.For<PhysicalFileManager>();
            _buildPathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());

            var packageModelMapper = Substitute.For<PackageModelMapper>();
            var packageModelSerializer = Substitute.For<PackageModelSerializer>();
            _contentProvider = Substitute.For<BuildContentProvider>(_fileManager, _buildPathProvider, packageModelSerializer, packageModelMapper);
            _previewBuilder = new CoursePreviewBuilder(_logger, _fileManager, _buildPathProvider, _contentProvider);
        }

        [TestMethod]
        public void Build_ShouldReturnTask()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _previewBuilder.Build(course);

            //Assert
            result.Should().BeOfType<Task<bool>>();
        }

        [TestMethod]
        public void Build_ShouldReturnSameTaskForOneCourse()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var task1 = _previewBuilder.Build(course);
            var task2 = _previewBuilder.Build(course);

            //Assert
            Assert.AreSame(task1, task2);
        }

        [TestMethod]
        public void Build_ShouldReturnDifferentTasksForDifferentCourses()
        {
            //Arrange
            var course1 = CourseObjectMother.Create();
            var course2 = CourseObjectMother.Create();

            //Act
            var task1 = _previewBuilder.Build(course1);
            var task2 = _previewBuilder.Build(course2);

            //Assert
            Assert.AreNotSame(task1, task2);
        }

        [TestMethod]
        public void Build_ShouldThrowArgumentNullException_WhenCourseIsNull()
        {
            //Arrange

            //Act
            Action action = () => _previewBuilder.Build(null);

            //Assert
            action.ShouldThrow<ArgumentNullException>().And.ParamName.Should().Be("course");
        }

        [TestMethod]
        public async Task Build_ShouldLogException_WhenExceptionRaised()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _fileManager.When(x => x.CreateDirectory(Arg.Any<string>()))
                        .Do(x => { throw new Exception(); });

            //Act
            await _previewBuilder.Build(course);

            //Assert
            _logger.Received().LogException(Arg.Any<Exception>());
        }

        [TestMethod]
        public async Task Build_ShouldReturnFalse_WhenExceptionRaised()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _fileManager.When(x => x.CreateDirectory(Arg.Any<string>()))
                        .Do(x => { throw new Exception(); });

            //Act
            var success = await _previewBuilder.Build(course);

            //Assert
            success.Should().Be(false);
        }

        [TestMethod]
        public async Task Build_ShouldGetPreviewCourseDirectoryPath()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            await _previewBuilder.Build(course);

            //Assert
            _buildPathProvider.Received().GetPreviewFolderPath(course.Id.ToString());
        }

        [TestMethod]
        public async Task Build_ShouldDeletePreviewCourseDirectory_WhenItExists()
        {
            //Arrange
            var previewDirectory = "PreviewCourseDirectory";
            var course = CourseObjectMother.Create();
            _buildPathProvider.GetPreviewFolderPath(Arg.Any<string>()).Returns(previewDirectory);
            _fileManager.DirectoryExists(Arg.Any<string>()).Returns(true);

            //Act
            await _previewBuilder.Build(course);

            //Assert
            _fileManager.Received().DeleteDirectory(previewDirectory);
        }

        [TestMethod]
        public async Task Build_ShouldCreatePreviewCourseDirectory()
        {
            //Arrange
            var previewDirectory = "PreviewCourseDirectory";
            var course = CourseObjectMother.Create();
            _buildPathProvider.GetPreviewFolderPath(Arg.Any<string>()).Returns(previewDirectory);

            //Act
            await _previewBuilder.Build(course);

            //Assert
            _fileManager.Received().CreateDirectory(previewDirectory);
        }

        [TestMethod]
        public async Task Build_ShouldAddBuildContentToPreviewDirectory()
        {
            //Arrange
            var previewDirectory = "PreviewCourseDirectory";
            var course = CourseObjectMother.Create();
            _buildPathProvider.GetPreviewFolderPath(Arg.Any<string>()).Returns(previewDirectory);

            //Act
            await _previewBuilder.Build(course);

            //Assert
            _contentProvider.Received().AddBuildContentToPackageDirectory(previewDirectory, course, "");
        }
    }
}
