using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.BuildExperience.PackageModel;
using easygenerator.Web.BuildExperience.Scorm;
using easygenerator.Web.BuildExperience.Scorm.Models;
using easygenerator.Web.Components;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using FluentAssertions;
using System.IO;

namespace easygenerator.Web.Tests.BuildExperience
{
    [TestClass]
    public class ScormExperienceBuilderTests
    {
        private ScormExperienceBuilder _builder;
        private PhysicalFileManager _fileManager;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private BuildPathProvider _buildPathProvider;
        private BuildPackageCreator _buildPackageCreator;
        private BuildContentProvider _buildContentProvider;
        private RazorTemplateProvider _razorTemplateProvider;

        private Experience _experience;
        private ExperiencePackageModel _experiencePackageModel;

        [TestInitialize]
        public void InitializeContext()
        {
            _experience = GetExperienceToBuild();
            _experiencePackageModel = new PackageModelMapper().MapExperience(_experience);

            _fileManager = Substitute.For<PhysicalFileManager>();

            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns(string.Empty);

            _buildPathProvider = Substitute.For<BuildPathProvider>(_httpRuntimeWrapper);
            _buildPackageCreator = Substitute.For<BuildPackageCreator>(_fileManager);
            DateTimeWrapper.Now = () => new DateTime(2013, 10, 12);

            _razorTemplateProvider = Substitute.For<RazorTemplateProvider>();

            var packageModelMapper = Substitute.For<PackageModelMapper>();
            var packageModelSerializer = Substitute.For<PackageModelSerializer>();
            _buildContentProvider = Substitute.For<BuildContentProvider>(_fileManager, _buildPathProvider, packageModelSerializer, packageModelMapper);

            _builder = new ScormExperienceBuilder(_fileManager, _buildPathProvider, _buildPackageCreator, _buildContentProvider, _razorTemplateProvider);
        }

        #region Build

        [TestMethod]
        public void Build_ShouldCreateBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeDirectoryPath";
            var buildId = _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _builder.Build(_experience);

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
            _builder.Build(_experience);

            //Assert
            _buildContentProvider.Received().AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience);
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
            _builder.Build(_experience);

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
            _builder.Build(_experience);

            //Assert
            _razorTemplateProvider.Received().Get("~/BuildExperience/Scorm/Templates/imsmanifest.cshtml",
                Arg.Is<ManifestModel>(m =>
                    m.MasteryScore == 100 &&
                    m.CourseTitle == _experience.Title &&
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
            _builder.Build(_experience);

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
            _builder.Build(_experience);

            //Assert
            _razorTemplateProvider.Received().Get("~/BuildExperience/Scorm/Templates/metadata.cshtml",
                Arg.Is<MetadataModel>(m =>
                    m.CourseTitle == _experience.Title &&
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
            _builder.Build(_experience);

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
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().WriteToFile(Path.Combine(buildDirectory, "imsmanifest.xml"), manifestContent);
        }

        #endregion

        #region Package creation

        [TestMethod]
        public void Build_ShouldCreatePackage()
        {
            //Arrange
            var buildDirectory = "SomeBuildPath";
            var buildPackageFileName = "SomePackageFileName";

            _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);
            _buildPathProvider.GetBuildPackageFileName(Arg.Any<string>()).Returns(buildPackageFileName);

            //Act
            _builder.Build(_experience);

            //Assert
            _buildPackageCreator.Received().CreatePackageFromFolder(buildDirectory, buildPackageFileName);
        }

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
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().DeleteFilesInDirectory(downloadPath, _experiencePackageModel.Id + "*.zip", buildId + ".zip");
        }

        [TestMethod]
        public void Build_ShouldDeletePreviousBuildFiles_WhenExceptionWasThwownDuringBuildPackageCreation()
        {
            //Arrange
            var downloadPath = "SomeDownloadPath";
            var buildId = GetBuildId();

            _buildPathProvider.GetDownloadPath().Returns(downloadPath);
            _buildContentProvider
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience))
                .Do(e => { throw null; });

            //Act
            _builder.Build(_experience);

            //Assert
            _fileManager.Received().DeleteFilesInDirectory(downloadPath, _experiencePackageModel.Id + "*.zip", buildId + ".zip");
        }

        [TestMethod]
        public void Build_ShouldDeleteBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeBuildDirectory";
            var buildId = GetBuildId();

            _buildPathProvider.GetBuildDirectoryName(buildId).Returns(buildDirectory);

            //Act
            _builder.Build(_experience);

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
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience))
                .Do(e => { throw null; });

            //Act
            _builder.Build(_experience);

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
                .When(e => e.AddBuildContentToPackageDirectory(Arg.Any<string>(), _experience))
                .Do(e => { throw null; });

            //Act
            var result = _builder.Build(_experience);

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
            var result = _builder.Build(_experience);

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
            var result = _builder.Build(_experience);

            //Assert
            result.Should().BeTrue();
        }


        #endregion

        #endregion

        #region Private methods

        private string GetBuildId()
        {
            return _experiencePackageModel.Id + String.Format(" {0:yyyyMMdd-HH-mm-ss}-UTC", DateTimeWrapper.Now());
        }

        private Experience GetExperienceToBuild()
        {
            var answer = AnswerObjectMother.Create("AnswerText", true);
            var explanation = LearningContentObjectMother.Create("Text");

            var question = QuestionObjectMother.Create("QuestionTitle");
            question.UpdateContent("Some question content", "SomeUser");
            question.AddAnswer(answer, "SomeUser");
            question.AddLearningContent(explanation, "SomeUser");

            var objective = ObjectiveObjectMother.Create("ObjectiveTitle");
            objective.AddQuestion(question, "SomeUser");

            var experience = ExperienceObjectMother.Create("ExperienceTitle");
            experience.UpdateTemplate(TemplateObjectMother.Create(name: "Default"), "SomeUser");
            experience.RelateObjective(objective, "SomeUser");

            return experience;
        }

        #endregion

    }
}
