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
        private BuildPathProvider _buildPathProvider;
        private IBuildContentProvider _buildContentProvider;
        private PackageModulesProvider _packageModulesProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _fileManager = Substitute.For<PhysicalFileManager>();
            _buildPathProvider = Substitute.For<BuildPathProvider>(Substitute.For<HttpRuntimeWrapper>());
            _buildContentProvider = Substitute.For<IBuildContentProvider>();
            _packageModulesProvider = Substitute.For<PackageModulesProvider>(Substitute.For<IUserRepository>());

            _builder = new LearningPathCourseBuilder(_fileManager, _buildPathProvider, _buildContentProvider, _packageModulesProvider);
        }

        [TestMethod]
        public void Build_ShouldCreateCourseBuildDirectory()
        {
            //Arrange
            var buildId = "buildId";
            var course = CourseObjectMother.Create();
            var courseDirectory = "courseDirectory";
            _buildPathProvider.GetBuildDirectoryName(buildId, course.Id.ToNString()).Returns(courseDirectory);

            //Act
            _builder.Build(course, buildId);

            //Assert
            _fileManager.Received().CreateDirectory(courseDirectory);
        }

        [TestMethod]
        public void Build_ShouldAddCourseContentIntoCourseDirectory()
        {
            //Arrange
            var buildId = "buildId";
            var course = CourseObjectMother.Create();
            var courseDirectory = "courseDirectory";
            _buildPathProvider.GetBuildDirectoryName(buildId, course.Id.ToNString()).Returns(courseDirectory);
            List<PackageModule> modules = new List<PackageModule>();
            _packageModulesProvider.GetModulesList(course).Returns(modules);

            //Act
            _builder.Build(course, buildId);

            //Assert
            _buildContentProvider.Received().AddBuildContentToPackageDirectory(courseDirectory, course, modules);
        }
    }
}
