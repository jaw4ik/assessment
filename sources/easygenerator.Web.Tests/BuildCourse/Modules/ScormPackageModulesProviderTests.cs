using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.BuildCourse.Modules.Models;
using easygenerator.Web.BuildCourse.Scorm.Modules;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildCourse.Modules
{
    [TestClass]
    public class ScormPackageModulesProviderTests
    {
        private IUserRepository _userRepository;
        private ScormPackageModulesProvider _scormPackageModulesProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _scormPackageModulesProvider = new ScormPackageModulesProvider(_userRepository);
        }

        [TestMethod]
        public void GetModulesList_ShouldReturnPackageModulesList()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _scormPackageModulesProvider.GetModulesList(course);

            //Assert
            result.Should().BeOfType<List<PackageModule>>();
        }

        [TestMethod]
        public void GetModulesList_ShouldReturnPackageModulesListWithLmsModule()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _scormPackageModulesProvider.GetModulesList(course);

            //Assert
            result.First(i => i.Name == "lms").Should().NotBeNull();
        }
    }
}
