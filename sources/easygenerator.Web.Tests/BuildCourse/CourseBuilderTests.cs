﻿using easygenerator.DomainModel.Entities;
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

namespace easygenerator.Web.Tests.BuildCourse
{
    [TestClass]
    public class CourseBuilderTests
    {
        private CourseBuilder _builder;
        private PhysicalFileManager _fileManager;
        private BuildPathProvider _buildPathProvider;
        private BuildPackageCreator _buildPackageCreator;
        private IBuildContentProvider _buildContentProvider;
        private PackageModulesProvider _packageModulesProvider;
        private IDomainEventPublisher _eventPublisher;

        private Course _course;
        private CoursePackageModel _coursePackageModel;

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
            _buildContentProvider = Substitute.For<IBuildContentProvider>();

            var userRepository = Substitute.For<IUserRepository>();
            _packageModulesProvider = Substitute.For<PackageModulesProvider>(userRepository);

            _builder = new CourseBuilder(_fileManager, _buildPathProvider, _buildPackageCreator, _buildContentProvider, _packageModulesProvider, Substitute.For<ILog>(), _eventPublisher);
        }

        #region Build

        [TestMethod]
        public void Build_ShouldPublishBuildStartedEvent()
        {
            //Act
            _builder.Build(_course);

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
            _builder.Build(_course);

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
            _builder.Build(_course);

            //Assert
            _buildContentProvider.Received().AddBuildContentToPackageDirectory(Arg.Any<string>(), _course, Arg.Any<IEnumerable<PackageModule>>());
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
            _builder.Build(_course);

            //Assert
            _buildPackageCreator.Received().CreatePackageFromFolder(buildDirectory, buildPackageFileName);
        }

        [TestMethod]
        public void Build_ShouldUpdateCourseBuildPath()
        {
            //Arrange
            var buildId = GetBuildId();

            //Act
            _builder.Build(_course);

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
            _fileManager
                .When(e => e.DeleteDirectory(Arg.Any<string>()))
                .Do(e => { throw null; });

            //Act
            var result = _builder.Build(_course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void Build_ShouldReturnTrue()
        {
            //Arrange

            //Act
            var result = _builder.Build(_course);

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

            var objective = ObjectiveObjectMother.Create("ObjectiveTitle");
            objective.AddQuestion(question, "SomeUser");

            var course = CourseObjectMother.Create("CourseTitle");
            course.UpdateTemplate(TemplateObjectMother.Create(name: "Default"), "SomeUser");
            course.RelateObjective(objective, null, "SomeUser");

            return course;
        }

        #endregion

    }
}
