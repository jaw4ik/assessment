using System.Collections;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.PackageModel;
using easygenerator.Web.BuildCourse.PublishSettings;
using easygenerator.Web.Components;
using easygenerator.Web.Extensions;
using easygenerator.Web.Storage;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Linq;
using easygenerator.Infrastructure.Net;
using easygenerator.Web.Components.Elmah;

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class CourseContentProviderTests
    {
        private CourseContentProvider _buildContentProvider;

        private Course _course;
        private CoursePackageModel _coursePackageModel;

        private CourseContentPathProvider _buildPathProvider;
        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _fileManager;
        private PackageModelSerializer _packageModelSerializer;
        private PackageModelMapper _packageModelMapper;
        private PublishSettingsProvider _publishSettingsProvider;
        private ITemplateStorage _templateStorage;
        private IEnumerable<PackageModule> _packageModules;
        private PackageMediaFetcher _packageMediaFetcher;
        private IPackageFontsFetcher _packageFontsFetcher;

        [TestInitialize]
        public void InitializeContext()
        {
            _packageModules = new List<PackageModule>();

            _course = GetCourseToBuild();
            _coursePackageModel = new PackageModelMapper(Substitute.For<IUrlHelperWrapper>(), Substitute.For<IUserRepository>()).MapCourse(_course);

            _fileManager = Substitute.For<PhysicalFileManager>();
            _packageModelSerializer = Substitute.For<PackageModelSerializer>();

            _httpRuntimeWrapper = Substitute.For<HttpRuntimeWrapper>();
            _httpRuntimeWrapper.GetDomainAppPath().Returns(string.Empty);

            _buildPathProvider = Substitute.For<CourseContentPathProvider>();
            _packageModelMapper = Substitute.For<PackageModelMapper>(Substitute.For<IUrlHelperWrapper>(), Substitute.For<IUserRepository>());
            _packageModelMapper.MapCourse(_course).Returns(_coursePackageModel);

            _publishSettingsProvider = Substitute.For<PublishSettingsProvider>();

            _templateStorage = Substitute.For<ITemplateStorage>();
            _packageMediaFetcher = Substitute.For<PackageMediaFetcher>(_buildPathProvider, _fileManager, new ElmahLog(), new FileDownloader());
            _packageFontsFetcher = Substitute.For<IPackageFontsFetcher>();
            _buildContentProvider = new CourseContentProvider(_fileManager, _buildPathProvider, _packageModelSerializer, _templateStorage, _packageModelMapper, _packageMediaFetcher, _packageFontsFetcher);
        }

        #region AddBuildContentToPackageDirectory

        #region Add template directory

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldCopyTemplateToBuildDirectory()
        {
            //Arrange
            var buildDirectory = "SomeDirectoryPath";
            var templateDirectory = "SomeTemplatePath";

            _templateStorage.GetTemplateDirectoryPath(_course.Template).Returns(templateDirectory);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(buildDirectory, _course);

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
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

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
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.Received().CreateDirectory(contentDirectory);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldWriteCourseIntroductionContentToFile_WhenCourseContentIsDefined()
        {
            //Arrange
            var courseContentPath = "SomePath";
            _buildPathProvider.GetCourseIntroductionContentFileName(Arg.Any<string>()).Returns(courseContentPath);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.Received().WriteToFile(courseContentPath, _course.IntroductionContent);

        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldNotWriteCourseIntroductionContentToFile_WhenCourseContentIsNull()
        {
            //Arrange
            var courseContentPath = "SomePath";
            _buildPathProvider.GetCourseIntroductionContentFileName(Arg.Any<string>()).Returns(courseContentPath);
            _course.UpdateIntroductionContent(null, "SomeUser");

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.DidNotReceive().WriteToFile(courseContentPath, _course.IntroductionContent);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldCreateSectionDirectory()
        {
            //Arrange
            var sectionDirectory = "SomeSectionPath";
            _buildPathProvider.GetSectionDirectoryName(Arg.Any<string>(), _course.RelatedSections.ToArray()[0].Id.ToNString()).Returns(sectionDirectory);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.Received().CreateDirectory(sectionDirectory);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldCreateQuestionDirectory()
        {
            //Arrange
            var questionDirectory = "SomeQuestionPath";
            _buildPathProvider.GetQuestionDirectoryName(Arg.Any<string>(),
                _course.RelatedSections.ToArray()[0].Id.ToNString(),
                _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                .Returns(questionDirectory);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.Received().CreateDirectory(questionDirectory);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldWriteQuestionContentToFile_WhenQuestionContentIsDefined()
        {
            //Arrange
            var questionContentPath = "SomePath";
            _buildPathProvider.GetQuestionContentFileName(Arg.Any<string>(),
                _course.RelatedSections.ToArray()[0].Id.ToNString(),
                _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                .Returns(questionContentPath);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.Received().WriteToFile(questionContentPath, _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Content);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldNotWriteQuestionContentToFile_WhenQuestionContentIsNull()
        {
            //Arrange
            _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].UpdateContent(null, "SomeUser");
            var questionContentPath = "SomePath";

            _buildPathProvider.GetQuestionContentFileName(Arg.Any<string>(),
                _course.RelatedSections.ToArray()[0].Id.ToNString(),
                _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                .Returns(questionContentPath);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.DidNotReceive().WriteToFile(questionContentPath, _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Content);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldWriteLearningContentsToFile()
        {
            //Arrange
            var learningContentsFilePath = "SomeELearningContentsPath";
            _buildPathProvider.GetLearningContentFileName(Arg.Any<string>(),
                _course.RelatedSections.ToArray()[0].Id.ToNString(),
                _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Id.ToNString(),
                _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0].Id.ToNString())
                .Returns(learningContentsFilePath);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.Received().WriteToFile(learningContentsFilePath, _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].LearningContents.ToArray()[0].Text);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldWriteQuestionCorrectFeedbackToFile_WhenItIsNotEmpty()
        {
            //Arrange
            var feedbackContentPath = "correctFeedbackPath";

            _buildPathProvider.GetCorrectFeedbackContentFileName(Arg.Any<string>(),
                _course.RelatedSections.ToArray()[0].Id.ToNString(),
                _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                .Returns(feedbackContentPath);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.Received().WriteToFile(feedbackContentPath, _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Feedback.CorrectText);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldWriteQuestionIncorrectFeedbackToFile_WhenItIsNotEmpty()
        {
            //Arrange
            var feedbackContentPath = "incorrectFeedbackPath";

            _buildPathProvider.GetIncorrectFeedbackContentFileName(Arg.Any<string>(),
                _course.RelatedSections.ToArray()[0].Id.ToNString(),
                _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Id.ToNString())
                .Returns(feedbackContentPath);

            //Act
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _fileManager.Received().WriteToFile(feedbackContentPath, _course.RelatedSections.ToArray()[0].Questions.ToArray()[0].Feedback.IncorrectText);
        }

        #endregion

        #region AddSettingsFileToPackageDirectory

        [TestMethod]
        public void AddSettingsFileToPackageDirectory_ShouldWriteCourseTemplateSettingsToFile()
        {
            //Arrange		
            string settingsFileName = "settingsFileName";
            string settings = "settings";
            _buildPathProvider.GetSettingsFileName(Arg.Any<string>()).Returns(settingsFileName);

            //Act		
            _buildContentProvider.AddSettingsFileToPackageDirectory(Arg.Any<string>(), settings);

            //Assert		
            _fileManager.Received().WriteToFile(settingsFileName, settings);
        }

        [TestMethod]
        public void AddBuildContentToPackageDirectory_ShouldWriteEmptyCourseTemplateSettingsToFile_WhenTemplateSettingsDoNotExist()
        {
            //Arrange		
            const string settingsFileName = "settingsFileName";
            _buildPathProvider.GetSettingsFileName(Arg.Any<string>()).Returns(settingsFileName);

            //Act		
            _buildContentProvider.AddSettingsFileToPackageDirectory(Arg.Any<string>(), null);

            //Assert		
            _fileManager.Received().WriteToFile(settingsFileName, "{}");
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
            _buildContentProvider.AddBuildContentToPackageDirectory(Arg.Any<string>(), _course);

            //Assert
            _packageModelSerializer.Received().Serialize(_coursePackageModel);
            _fileManager.Received().WriteToFile(packageModelFilePath, serializedPackageModel);
        }

        #endregion

        #endregion

        #region Private methods

        private Course GetCourseToBuild()
        {
            var answer = AnswerObjectMother.Create("AnswerText", true);
            var explanation = LearningContentObjectMother.Create("Text");

            var question = MultipleselectObjectMother.Create("QuestionTitle");
            question.UpdateContent("Some question content", "SomeUser");
            question.AddAnswer(answer, "SomeUser");
            question.AddLearningContent(explanation, "SomeUser");
            question.UpdateCorrectFeedbackText("Correct feedback text");
            question.UpdateIncorrectFeedbackText("Incorrect feedback text");

            var section = SectionObjectMother.Create("SectionTitle");
            section.AddQuestion(question, "SomeUser");

            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdateIntroductionContent("some course content", "SomeUser");
            course.UpdateTemplate(TemplateObjectMother.Create(name: "Default"), "SomeUser");
            course.RelateSection(section, null, "SomeUser");

            return course;
        }

        #endregion
    }
}
