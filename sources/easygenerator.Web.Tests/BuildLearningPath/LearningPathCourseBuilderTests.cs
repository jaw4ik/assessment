using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildLearningPath;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;
using easygenerator.Web.BuildCourse.PublishSettings;

namespace easygenerator.Web.Tests.BuildLearningPath
{
    [TestClass]
    public class LearningPathCourseBuilderTests
    {
        private LearningPathCourseBuilder _builder;
        private PhysicalFileManager _fileManager;
        private LearningPathContentPathProvider _contentPathProvider;
        private ICourseContentProvider _buildContentProvider;
        private PackageModulesProvider _packageModulesProvider;
        private PublishSettingsProvider _publishSettingsProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = Substitute.For<PhysicalFileManager>();
            _contentPathProvider = Substitute.For<LearningPathContentPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _buildContentProvider = Substitute.For<ICourseContentProvider>();
            _packageModulesProvider = Substitute.For<PackageModulesProvider>(Substitute.For<IUserRepository>());
            _publishSettingsProvider = Substitute.For<PublishSettingsProvider>();

            _builder = new LearningPathCourseBuilder(_fileManager, _contentPathProvider, _buildContentProvider, _packageModulesProvider, _publishSettingsProvider);
        }

        [TestMethod]
        public void Build_ShouldCreateCourseBuildDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var course = CourseObjectMother.Create();
            var learningPath = LearningPathObjectMother.Create();

            var courseDirectory = "courseDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, course.Id.ToNString()).Returns(courseDirectory);

            //Act
            _builder.Build(buildDirectoryPath, course, learningPath);

            //Assert
            _fileManager.Received().CreateDirectory(courseDirectory);
        }

        [TestMethod]
        public void Build_ShouldAddCourseContentIntoCourseDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var course = CourseObjectMother.Create();
            var learningPath = LearningPathObjectMother.Create();

            var courseDirectory = "courseDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, course.Id.ToNString()).Returns(courseDirectory);
            
            //Act
            _builder.Build(buildDirectoryPath, course, learningPath);

            //Assert
            _buildContentProvider.Received().AddBuildContentToPackageDirectory(courseDirectory, course);
        }

        [TestMethod]
        public void Build_ShouldAddLearningPathSettingsIntoCourseDirectory_WhenCourseSettingsAreNull()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var course = CourseObjectMother.Create();
            var learningPath = LearningPathObjectMother.Create();

            var courseDirectory = "courseDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, course.Id.ToNString()).Returns(courseDirectory);

            var learningPathSettings = "{\"name\":\"learning path\"}";
            learningPath.SaveLearningPathSettings(learningPathSettings);

            //Act
            _builder.Build(buildDirectoryPath, course, learningPath);

            //Assert
            _buildContentProvider.Received().AddSettingsFileToPackageDirectory(courseDirectory, learningPathSettings);
        }

        [TestMethod]
        public void Build_ShouldUpdateCourseSettingsWithLearningPathSettingsIntoCourseDirectory_WhenCourseSettingsExist()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var course = CourseObjectMother.Create();

            var template = TemplateObjectMother.Create();
            var courseSettings = "{\"name\":{\"key1\":\"course1\",\"key2\":\"course2\"},\"other\":\"text\"}";
            course.UpdateTemplate(template, "user");
            course.SaveTemplateSettings(template, courseSettings, "");

            var courseDirectory = "courseDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, course.Id.ToNString()).Returns(courseDirectory);

            var learningPath = LearningPathObjectMother.Create();
            var learningPathSettings = "{\"name\":{\"key1\":\"learning path1\",\"key3\":\"course3\"}}";
            learningPath.SaveLearningPathSettings(learningPathSettings);

            //Act
            _builder.Build(buildDirectoryPath, course, learningPath);

            //Assert
            _buildContentProvider.Received().AddSettingsFileToPackageDirectory(courseDirectory, "{\"name\":{\"key1\":\"learning path1\",\"key2\":\"course2\",\"key3\":\"course3\"},\"other\":\"text\"}");
        }

        [TestMethod]
        public void Build_ShouldUpdateCoursePublishSettingsIntoCourseDirectory_WhenCourseSettingsExist()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var course = CourseObjectMother.Create();
            var learningPath = LearningPathObjectMother.Create();

            var courseDirectory = "courseDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, course.Id.ToNString()).Returns(courseDirectory);
            
            var modules = new List<PackageModule>();
            _packageModulesProvider.GetModulesList(course).Returns(modules);
            
            var publishSettings = "{test: test}";
            _publishSettingsProvider.GetPublishSettings(modules, PublishSettingsProvider.Mode.Default, Arg.Any<Dictionary<string, int>>(), null).Returns(publishSettings);

            //Act
            _builder.Build(buildDirectoryPath, course, learningPath);

            //Assert
            _buildContentProvider.Received().AddPublishSettingsFileToPackageDirectory(courseDirectory, publishSettings);
        }

        [TestMethod]
        public void Build_ShouldUpdateCourseModulesFilesIntoCourseDirectory_WhenCourseSettingsExist()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var course = CourseObjectMother.Create();
            var learningPath = LearningPathObjectMother.Create();

            var courseDirectory = "courseDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, course.Id.ToNString()).Returns(courseDirectory);

            List<PackageModule> modules = new List<PackageModule>();
            _packageModulesProvider.GetModulesList(course).Returns(modules);

            //Act
            _builder.Build(buildDirectoryPath, course, learningPath);

            //Assert
            _buildContentProvider.Received().AddModulesFilesToPackageDirectory(courseDirectory, modules);
        }
    }
}
