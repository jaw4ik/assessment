using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.BuildCourse.Scorm;
using easygenerator.Web.BuildCourse.Scorm.Models;
using easygenerator.Web.BuildCourse.Scorm.Modules;
using easygenerator.Web.Components;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.IO;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class ScormCourseBuilderTests
    {
        private ScormCourseBuilder _builder;
        private PhysicalFileManager _fileManager;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private BuildPathProvider _buildPathProvider;
        private BuildPackageCreator _buildPackageCreator;
        private ICourseContentProvider _buildContentProvider;
        private RazorTemplateProvider _razorTemplateProvider;
        private ScormPackageModulesProvider _scormPackageModulesProvider;

        private Course _course;
        private CoursePackageModel _coursePackageModel;

        [TestInitialize]
        public void InitializeContext()
        {
            _course = GetCourseToBuild();
            _coursePackageModel = new PackageModelMapper(Substitute.For<IUrlHelperWrapper>(), Substitute.For<IUserRepository>()).MapCourse(_course);

            _fileManager = Substitute.For<PhysicalFileManager>();

            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns(string.Empty);

            _buildPathProvider = Substitute.For<BuildPathProvider>(_httpRuntimeWrapper);
            _buildPackageCreator = Substitute.For<BuildPackageCreator>(_fileManager);
            DateTimeWrapper.Now = () => new DateTime(2013, 10, 12);

            _razorTemplateProvider = Substitute.For<RazorTemplateProvider>();

            _buildContentProvider = Substitute.For<ICourseContentProvider>();

            var userRepository = Substitute.For<IUserRepository>();
            _scormPackageModulesProvider = Substitute.For<ScormPackageModulesProvider>(userRepository);

            _builder = new ScormCourseBuilder(_fileManager, _buildPathProvider, _buildPackageCreator, _buildContentProvider, _razorTemplateProvider, _scormPackageModulesProvider, Substitute.For<ILog>());
        }

        #region Build

        [TestMethod]
        public void Build_ShouldCreateBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeDirectoryPath";
            var buildId = _coursePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _builder.Build(_course);

            //Assert
            _fileManager.Received().CreateDirectory(buildDirectory);
        }

        [TestMethod]
        public void Build_ShouldAddBuildContentToPackage()
        {
            //Arrange
            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns("SomeBuildPath");
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns("SomePackageFileName");

            //Act
            _builder.Build(_course);

            //Assert
            _buildContentProvider.Received().AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<IEnumerable<PackageModule>>());
        }

        #region Add xsd schemas to package

        [TestMethod]
        public void Build_ShouldCopyXsdScemasToPackage()
        {
            //Arrange
            var buildDirectory = "SomeBuildPath";
            var buildPackageFileName = "SomePackageFileName";

            string[] files = new string[] { "file.xsd", "schema.xsd" };
            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns(buildPackageFileName);
            _fileManager.GetAllFilesInDirectory(Arg.Any<string>()).Returns(files);

            //Act
            _builder.Build(_course);

            //Assert
            _fileManager.Received().CopyFileToDirectory(files[0], buildDirectory);
            _fileManager.Received().CopyFileToDirectory(files[1], buildDirectory);
        }

        #endregion

        #region Add manifest file

        [TestMethod]
        public void Build_ShouldGenerateManifest()
        {
            //Arrange
            var resources = new string[] { "1.html", "2.js" };
            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns("SomeBuildPath");
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns("SomePackageFileName");
            _fileManager.GetAllFilesInDirectory(Arg.Any<string>()).Returns(resources);
            _fileManager.GetRelativePath(Arg.Any<string>(), Arg.Any<string>()).Returns(e => e[0]);

            //Act
            _builder.Build(_course);

            //Assert
            _razorTemplateProvider.Received().Get("~/BuildCourse/Scorm/Templates/imsmanifest.cshtml",
                Arg.Is<ManifestModel>(m =>
                    m.MasteryScore == 100 &&
                    m.CourseTitle == _course.Title &&
                    m.StartPage == "index.html" &&
                    m.Resources.Count == 2 &&
                    m.Resources[0] == resources[0] &&
                    m.Resources[1] == resources[1])
                );
        }

        [TestMethod]
        public void Build_ShouldAddManifestFileToPackage()
        {
            //Arrange
            const string buildDirectory = "SomeBuildPath";
            const string manifestContent = "<xml>Manifest content</xml>";
            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _razorTemplateProvider.Get(Arg.Any<string>(), Arg.Any<object>()).Returns(manifestContent);

            //Act
            _builder.Build(_course);

            //Assert
            _fileManager.Received().WriteToFile(Path.Combine(buildDirectory, "imsmanifest.xml"), manifestContent);
        }

        #endregion

        #region Add metadata file

        [TestMethod]
        public void Build_ShouldGenerateMetadata()
        {
            //Arrange
            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns("SomeBuildPath");
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns("SomePackageFileName");

            //Act
            _builder.Build(_course);

            //Assert
            _razorTemplateProvider.Received().Get("~/BuildCourse/Scorm/Templates/metadata.cshtml",
                Arg.Is<MetadataModel>(m =>
                    m.CourseTitle == _course.Title &&
                    m.CourseLanguage == "en-US" &&
                    m.MetadataLanguage == "en")
                );
        }

        [TestMethod]
        public void Build_ShouldAddMetadataFileToPackage()
        {
            //Arrange
            const string buildDirectory = "SomeBuildPath";
            const string metadataContent = "<xml>Metadata content</xml>";
            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _razorTemplateProvider.Get(Arg.Any<string>(), Arg.Any<object>()).Returns(metadataContent);

            //Act
            _builder.Build(_course);

            //Assert
            _fileManager.Received().WriteToFile(Path.Combine(buildDirectory, "metadata.xml"), metadataContent);
        }

        [TestMethod]
        public void Build_ShouldAddMetdataFileToPackage()
        {
            //Arrange
            const string buildDirectory = "SomeBuildPath";
            const string manifestContent = "<xml>Manifest content</xml>";
            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _razorTemplateProvider.Get(Arg.Any<string>(), Arg.Any<object>()).Returns(manifestContent);

            //Act
            _builder.Build(_course);

            //Assert
            _fileManager.Received().WriteToFile(Path.Combine(buildDirectory, "imsmanifest.xml"), manifestContent);
        }

        #endregion

        #region Package creation

        [TestMethod]
        public void Build_ShouldUpdateCourseScormPackageUrl()
        {
            //Arrange
            var buildId = GetBuildId();

            //Act
            _builder.Build(_course);

            //Assert
            _course.ScormPackageUrl.Should().Be(buildId + ".zip");
        }

        #endregion

        #region Update ScormPackageUrl



        #endregion

        #region Files cleanup

        [TestMethod]
        public void Build_ShouldDeletePreviousBuildFiles()
        {
            //Arrange
            var downloadPath = "SomeDownloadPath";
            var buildId = GetBuildId();

            _buildPathProvider.GetDownloadPath().Returns(downloadPath);

            //Act
            _builder.Build(_course);

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
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<IEnumerable<PackageModule>>()))
                .Do(e => { throw null; });

            //Act
            _builder.Build(_course);

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
            _builder.Build(_course);

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
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<IEnumerable<PackageModule>>()))
                .Do(e => { throw null; });

            //Act
            _builder.Build(_course);

            //Assert
            _fileManager.Received().DeleteDirectory(buildDirectory);
        }


        #endregion

        #region Return value

        [TestMethod]
        public void Build_ShouldReturnFalse_WhenExceptionWasThwownDuringBuildPackageCreation()
        {
            //Arrange
            _buildContentProvider
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<IEnumerable<PackageModule>>()))
                .Do(e => { throw null; });

            //Act
            var result = _builder.Build(_course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void Build_ShouldReturnTrue_WhenExceptionWasThwownDuringTempDirectoryDeletion()
        {
            //Arrange
            var buildDirectory = "SomeBuildDirectory";
            _fileManager
                .When(e => e.DeleteDirectory(Arg.Any<string>()))
                .Do(e => { throw null; });

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _razorTemplateProvider.Get(Arg.Any<string>(), Arg.Any<object>()).Returns(String.Empty);

            //Act
            var result = _builder.Build(_course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void Build_ShouldReturnTrue()
        {
            //Arrange
            var buildDirectory = "SomeBuildDirectory";

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _razorTemplateProvider.Get(Arg.Any<string>(), Arg.Any<object>()).Returns(String.Empty);

            //Act
            var result = _builder.Build(_course);

            //Assert
            result.Should().BeTrue();
        }


        #endregion

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
            course.UpdateTemplate(TemplateObjectMother.Create(name: "Default"), "SomeUser");
            course.RelateSection(section, null, "SomeUser");

            return course;
        }

        #endregion

    }
}
