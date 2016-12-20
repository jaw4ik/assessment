using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.Components;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.Web.BuildCourse.PublishSettings;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class CourseBuilderTests
    {
        private CourseBuilder _builder;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _buildPathProvider;
        private BuildPackageCreator _buildPackageCreator;
        private ICourseContentProvider _buildContentProvider;
        private PackageModulesProvider _packageModulesProvider;
        private IDomainEventPublisher _eventPublisher;
        private PublishSettingsProvider _publishSettingsProvider;

        private Course _course;
        private CoursePackageModel _coursePackageModel;

        private const string TemplateSettings = "template settings";
        private const string ThemeSettings = "theme settings";

        [TestInitialize]
        public void InitializeContext()
        {
            _course = GetCourseToBuild();
            _coursePackageModel = new PackageModelMapper(Substitute.For<IUrlHelperWrapper>(), Substitute.For<IUserRepository>()).MapCourse(_course);

            _fileManager = Substitute.For<PhysicalFileManager>();

            _buildPathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _buildPackageCreator = Substitute.For<BuildPackageCreator>(_fileManager);
            DateTimeWrapper.Now = () => new DateTime(2013, 10, 12);

            _eventPublisher = Substitute.For<IDomainEventPublisher>();
            _buildContentProvider = Substitute.For<ICourseContentProvider>();

            var userRepository = Substitute.For<IUserRepository>();
            _packageModulesProvider = Substitute.For<PackageModulesProvider>(userRepository);

            _publishSettingsProvider = Substitute.For<PublishSettingsProvider>();

            _builder = new CourseBuilder(_fileManager, _buildPathProvider, _buildPackageCreator, _buildContentProvider, _packageModulesProvider, _publishSettingsProvider, Substitute.For<ILog>(), _eventPublisher);
        }

        #region Build

        [TestMethod]
        public void Build_ShouldPublishBuildStartedEvent()
        {
            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _eventPublisher.ShouldPublishEvent<CourseBuildStartedEvent>();
        }

        [TestMethod]
        public void Build_ShouldCreateBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeDirectoryPath";
            var buildId = GetBuildId();
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _fileManager.Received().CreateDirectory(buildDirectory);
        }

        [TestMethod]
        public void Build_ShouldAddBuildContentToPackage()
        {
            //Arrange
            var buildDirectory = "SomeBuildPath";
            var buildPackageFileName = "SomePackageFileName";

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns(buildPackageFileName);

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _buildContentProvider.Received().AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);
        }

        [TestMethod]
        public void Build_ShouldAddTemplateSettingsToPackage()
        {
            //Arrange
            var buildDirectory = "SomeBuildPath";
            var buildPackageFileName = "SomePackageFileName";

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns(buildPackageFileName);
            
            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _buildContentProvider.Received().AddSettingsFileToPackageDirectory(Arg.Any<string>(), TemplateSettings);
        }

        [TestMethod]
        public void Build_ShouldAddThemeSettingsToPackage()
        {
            //Arrange
            var buildDirectory = "SomeBuildPath";
            var buildPackageFileName = "SomePackageFileName";

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns(buildPackageFileName);

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _buildContentProvider.Received().AddThemeSettingsFileToPackageDirectory(Arg.Any<string>(), ThemeSettings);
        }

        [TestMethod]
        public void Build_ShouldRefreshQuestionShortIdsInfo()
        {
            //Arrange
            var buildDirectory = "SomeBuildPath";
            var buildPackageFileName = "SomePackageFileName";

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns(buildPackageFileName);

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            var results = _course.QuestionShortIdsInfo.GetShortIds();
            results.Count.Should().Be(2);
            results[_course.RelatedSections.ElementAt(0).Questions.ElementAt(0).Id.ToString("N")].Should().Be(0);
            results[CourseQuestionShortIdsInfo.NextAvailableIndex].Should().Be(1);
        }

        [TestMethod]
        public void Build_ShouldCreatePackage()
        {
            //Arrange
            var buildDirectory = "SomeBuildPath";
            var buildPackageFileName = "SomePackageFileName";

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns(buildPackageFileName);

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _buildPackageCreator.Received().CreatePackageFromFolder(buildDirectory, buildPackageFileName);
        }

        [TestMethod]
        public void Build_ShouldUpdateCourseBuildPath()
        {
            //Arrange
            var buildId = GetBuildId();

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _course.PackageUrl.Should().Be(buildId + ".zip");
            _course.BuildOn.Should().Be(DateTimeWrapper.Now());
        }

        [TestMethod]
        public void Build_ShouldDeletePreviousBuildFiles()
        {
            //Arrange
            var downloadPath = "SomeDownloadPath";
            var buildId = GetBuildId();

            _buildPathProvider.GetDownloadPath().Returns(downloadPath);

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _fileManager.Received().DeleteFilesInDirectory(downloadPath, _coursePackageModel.Id + "*.zip", buildId + ".zip");
        }

        [TestMethod]
        public void Build_ShouldDeletePreviousBuildFiles_WhenExceptionWasThwownDuringBuildPackageCreation()
        {
            //Arrange
            var downloadPath = "SomeDownloadPath";
            var buildId = GetBuildId();

            _buildPathProvider.GetDownloadPath().Returns(downloadPath);
            _buildContentProvider
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course))
                .Do(e => { throw null; });

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _fileManager.Received().DeleteFilesInDirectory(downloadPath, _coursePackageModel.Id + "*.zip", buildId + ".zip");
        }

        [TestMethod]
        public void Build_ShouldDeleteBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeBuildDirectory";
            var buildId = GetBuildId();

            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _fileManager.Received().DeleteDirectory(buildDirectory);
        }

        [TestMethod]
        public void Build_ShouldDeleteBuildDirectory_WhenExceptionWasThwownDuringBuildPackageCreation()
        {
            //Arrange
            var buildDirectory = "SomeBuildDirectory";

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _buildContentProvider
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course))
                .Do(e => { throw null; });

            //Act
            _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            _fileManager.Received().DeleteDirectory(buildDirectory);
        }

        [TestMethod]
        public void Build_ShouldReturnFalse_WhenExceptionWasThwownDuringBuildPackageCreation()
        {
            //Arrange
            _buildContentProvider
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course))
                .Do(e => { throw null; });

            //Act
            var result = _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void Build_ShouldReturnTrue_WhenExceptionWasThwownDuringTempDirectoryDeletion()
        {
            //Arrange
            _fileManager
                .When(e => e.DeleteDirectory(Arg.Any<string>()))
                .Do(e => { throw null; });

            //Act
            var result = _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void Build_ShouldReturnTrue()
        {
            //Arrange

            //Act
            var result = _builder.Build(_course, PublishSettingsProvider.Mode.Default);

            //Assert
            result.Should().BeTrue();
        }

        #endregion

        #region Private methods

        private string GetBuildId()
        {
            return _coursePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
        }

        private Course GetCourseToBuild()
        {
            var answer = AnswerObjectMother.Create("AnswerText", true);
            var explanation = LearningContentObjectMother.Create("Text");

            var question = MultipleselectObjectMother.Create("QuestionTitle");
            question.UpdateContent("Some question content", "SomeUser");
            question.AddAnswer(answer, "SomeUser");
            question.AddLearningContent(explanation, "SomeUser");

            var section = SectionObjectMother.Create("SectionTitle");
            section.AddQuestion(question, "SomeUser");

            var course = CourseObjectMother.Create("CourseTitle");
            var template = TemplateObjectMother.Create(name: "Default");

            course.UpdateTemplate(template, "SomeUser");
            course.SaveTemplateSettings(template, TemplateSettings, "");
            course.RelateSection(section, null, "SomeUser");

            var theme = ThemeObjectMother.Create(template, "My theme", ThemeSettings);
            course.AddTemplateTheme(template, theme);
            
            return course;
        }

        #endregion

    }
}
