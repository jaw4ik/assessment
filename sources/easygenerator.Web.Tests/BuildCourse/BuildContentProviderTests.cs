using System;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class BuildContentProviderTests
    {
        private BuildContentProvider _buildContentProvider;

        private Course _course;
        private CoursePackageModel _coursePackageModel;

        private BuildPathProvider _buildPathProvider;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _fileManager;
        private PackageModelSerializer _packageModelSerializer;
        private PackageModelMapper _packageModelMapper;

        [TestInitialize]
        public void InitializeContext()
        {
            _course = GetCourseToBuild();
            _coursePackageModel = new PackageModelMapper().MapCourse(_course);

            _fileManager = Substitute.For<PhysicalFileManager>();
            _packageModelSerializer = Substitute.For<PackageModelSerializer>();

            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns(string.Empty);

            _buildPathProvider = Substitute.For<BuildPathProvider>(_httpRuntimeWrapper);
            _packageModelMapper = Substitute.For<PackageModelMapper>();
            _packageModelMapper.MapCourse(_course).Returns(_coursePackageModel);

            _buildContentProvider = new BuildContentProvider(_fileManager, _buildPathProvider, _packageModelSerializer, _packageModelMapper);
        }

        #region AddBuildContentToPackageDirectory

            #region Add template directory

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldCopyTemplateToBuildDirectory()
            {
                //Arrange
                var buildDirectory = "SomeDirectoryPath";
                var templateDirectory = "SomeTemplatePath";
                //var buildId = GetBuildId();

                _buildPathProvider.GetTemplateDirectoryName(_course.Template.Name).Returns(templateDirectory);
                _buildPathProvider.GetBuildDirectoryName(Arg.Any<string>()).Returns(buildDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.Received().CopyDirectory(templateDirectory, buildDirectory);
            }

            #endregion

            #region Add course content

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldDeleteContentDirectory()
            {
                //Arrange
                var contentDirectory = "SomeContentPath";
                _buildPathProvider.GetContentDirectoryName(Arg.Any<string>()).Returns(contentDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.Received().DeleteDirectory(contentDirectory);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldCreateContentDirectory()
            {
                //Arrange
                var contentDirectory = "SomeContentPath";
                _buildPathProvider.GetContentDirectoryName(Arg.Any<string>()).Returns(contentDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.Received().CreateDirectory(contentDirectory);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldCreateObjectiveDirectory()
            {
                //Arrange
                var objectiveDirectory = "SomeObjectivePath";
                _buildPathProvider.GetObjectiveDirectoryName(Arg.Any<string>(), _course.RelatedObjectives.ToArray()[0].Id.ToNString()).Returns(objectiveDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.Received().CreateDirectory(objectiveDirectory);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldCreateQuestionDirectory()
            {
                //Arrange
                var questionDirectory = "SomeQuestionPath";
                _buildPathProvider.GetQuestionDirectoryName(Arg.Any<string>(),
                    _course.RelatedObjectives.ToArray()[0].Id.ToNString(),
                    _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                    .Returns(questionDirectory);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.Received().CreateDirectory(questionDirectory);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteQuestionContentToFile_WhenQuestionContentIsDefined()
            {
                //Arrange
                var questionContentPath = "SomePath";
                _buildPathProvider.GetQuestionContentFileName(Arg.Any<string>(),
                    _course.RelatedObjectives.ToArray()[0].Id.ToNString(),
                    _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                    .Returns(questionContentPath);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.Received().WriteToFile(questionContentPath, _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Content);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldNotWriteQuestionContentToFile_WhenQuestionContentIsNull()
            {
                //Arrange
                _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].UpdateContent(null, "SomeUser");
                var questionContentPath = "SomePath";

                _buildPathProvider.GetQuestionContentFileName(Arg.Any<string>(),
                    _course.RelatedObjectives.ToArray()[0].Id.ToNString(),
                    _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                    .Returns(questionContentPath);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.DidNotReceive().WriteToFile(questionContentPath, _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Content);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteLearningContentsToFile()
            {
                //Arrange
                var learningContentsFilePath = "SomeELearningContentsPath";
                _buildPathProvider.GetLearningContentFileName(Arg.Any<string>(),
                    _course.RelatedObjectives.ToArray()[0].Id.ToNString(),
                    _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].Id.ToNString(),
                    _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0].Id.ToNString())
                    .Returns(learningContentsFilePath);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.Received().WriteToFile(learningContentsFilePath, _course.RelatedObjectives.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0].Text);
            }

            #endregion

            #region Add course data file

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteSerializedPackageModelToFile()
            {
                //Arrange
                var packageModelFilePath = "SomePackageModelPath";
                var serializedPackageModel = "SomePackageModelData";

                _buildPathProvider.GetDataFileName(Arg.Any<string>()).Returns(packageModelFilePath);
                _packageModelSerializer.Serialize(_coursePackageModel).Returns(serializedPackageModel);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _packageModelSerializer.Received().Serialize(_coursePackageModel);
                _fileManager.Received().WriteToFile(packageModelFilePath, serializedPackageModel);
            }

            #endregion

            #region Add template settings file

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteCourseTemplateSettingsToFile()
            {
                //Arrange
                string settingsFileName = "settingsFileName";
                string settings = "settings";

                var course = Substitute.For<Course>();
                course.Template.Returns(Substitute.For<Template>());
                course.GetTemplateSettings(Arg.Any<Template>()).Returns(settings);

                _packageModelMapper.MapCourse(course).Returns(_coursePackageModel);
                _buildPathProvider.GetSettingsFileName(Arg.Any<string>()).Returns(settingsFileName);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), course, Arg.Any<string>());

                //Assert
                _fileManager.Received().WriteToFile(settingsFileName, settings);
            }

            [TestMethod]
            public void AddBuildContentToPackageDirectory_ShouldWriteEmptyCourseTemplateSettingsToFile_WhenTemplateSettingsDoNotExist()
            {
                //Arrange
                const string settingsFileName = "settingsFileName";

                var course = Substitute.For<Course>();
                course.Template.Returns(Substitute.For<Template>());
                course.GetTemplateSettings(course.Template).Returns((string)null);

                _packageModelMapper.MapCourse(course).Returns(_coursePackageModel);
                _buildPathProvider.GetSettingsFileName(Arg.Any<string>()).Returns(settingsFileName);

                //Act
                _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<string>());

                //Assert
                _fileManager.Received().WriteToFile(settingsFileName, String.Empty);
            }

            #endregion

        #endregion

        #region Private methods

        private Course GetCourseToBuild()
        {
            var answer = AnswerObjectMother.Create("AnswerText", true);
            var explanation = LearningContentObjectMother.Create("Text");

            var question = QuestionObjectMother.Create("QuestionTitle");
            question.UpdateContent("Some question content", "SomeUser");
            question.AddAnswer(answer, "SomeUser");
            question.AddLearningContent(explanation, "SomeUser");

            var objective = ObjectiveObjectMother.Create("ObjectiveTitle");
            objective.AddQuestion(question, "SomeUser");

            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdateTemplate(TemplateObjectMother.Create(name: "Default"), "SomeUser");
            course.RelateObjective(objective, "SomeUser");

            return course;
        }

        #endregion
    }
}
