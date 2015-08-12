using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse.Modules;
using easygenerator.Web.BuildCourse.Modules.Models;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.BuildCourse.Modules
{
    [TestClass]
    public class PackageModulesProviderTests
    {
        private IUserRepository _userRepository;
        private PackageModulesProvider _packageModulesProvider;
        private readonly DateTime CurrentDate = new DateTime(2014, 3, 19);

        [TestInitialize]
        public void InitializeContext()
        {
            _userRepository = Substitute.For<IUserRepository>();
            _packageModulesProvider = new PackageModulesProvider(_userRepository);

            DateTimeWrapper.Now = () => CurrentDate;
        }

        [TestMethod]
        public void GetModulesList_ShouldReturnPackageModulesList()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            var result = _packageModulesProvider.GetModulesList(course);

            //Assert
            result.Should().BeOfType<List<PackageModule>>();
        }

        [TestMethod]
        public void GetModulesList_ShouldReturnPackageModulesListWithBrandingModule_WhenUserHasFreePlan()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var user = UserObjectMother.Create();
            user.DowngradePlanToFree();
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            //Act
            var result = _packageModulesProvider.GetModulesList(course);

            //Assert
            result.Count().Should().Be(1);
            result.First().Name.Should().Be("branding");
        }

        [TestMethod]
        public void GetModulesList_ShouldReturnEmptyPackageModulesList_WhenUserHasStarterPlan()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var user = UserObjectMother.Create();
            user.UpgradePlanToStarter(DateTime.Now.AddDays(1));
            _userRepository.GetUserByEmail(Arg.Any<string>()).Returns(user);

            //Act
            var result = _packageModulesProvider.GetModulesList(course);

            //Assert
            result.Count().Should().Be(0);
        }
    }
}
