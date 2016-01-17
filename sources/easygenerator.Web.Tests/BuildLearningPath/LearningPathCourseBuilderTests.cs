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

        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = Substitute.For<PhysicalFileManager>();
            _contentPathProvider = Substitute.For<LearningPathContentPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _buildContentProvider = Substitute.For<ICourseContentProvider>();
            _packageModulesProvider = Substitute.For<PackageModulesProvider>(Substitute.For<IUserRepository>());

            _builder = new LearningPathCourseBuilder(_fileManager, _contentPathProvider, _buildContentProvider, _packageModulesProvider);
        }

        [TestMethod]
        public void Build_ShouldCreateCourseBuildDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var course = CourseObjectMother.Create();
            var courseDirectory = "courseDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, course.Id.ToNString()).Returns(courseDirectory);

            //Act
            _builder.Build(buildDirectoryPath, course);

            //Assert
            _fileManager.Received().CreateDirectory(courseDirectory);
        }

        [TestMethod]
        public void Build_ShouldAddCourseContentIntoCourseDirectory()
        {
            //Arrange
            var buildDirectoryPath = "buildDirectoryPath";
            var course = CourseObjectMother.Create();
            var courseDirectory = "courseDirectory";
            _contentPathProvider.GetEntityDirectoryName(buildDirectoryPath, course.Id.ToNString()).Returns(courseDirectory);
            List<PackageModule> modules = new List<PackageModule>();
            _packageModulesProvider.GetModulesList(course).Returns(modules);

            //Act
            _builder.Build(buildDirectoryPath, course);

            //Assert
            _buildContentProvider.Received().AddBuildContentToPackageDirectory(courseDirectory, course, modules);
        }
    }
}
