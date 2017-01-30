using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Events;
using easygenerator.DomainModel.Events.CourseEvents;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Web.Domain.DomainOperations;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.Web.Tests.Domain.DomainOperations
{
    [TestClass]
    public class CourseOperationsTests
    {
        private CourseOperations _courseOperations;

        private IOrganizationUserRepository _organizationUserRepository;
        private ICourseRepository _courseRepository;
        private IDomainEventPublisher _eventPublisher;

        [TestInitialize]
        public void Initialize()
        {
            _organizationUserRepository = Substitute.For<IOrganizationUserRepository>();
            _courseRepository = Substitute.For<ICourseRepository>();
            _eventPublisher = Substitute.For<IDomainEventPublisher>();

            _courseOperations = new CourseOperations(_organizationUserRepository, _courseRepository, _eventPublisher);
        }

        #region CreateCourse

        [TestMethod]
        public void CreateCourse_ShouldAddCourseToRepository()
        {
            //Arrange
            var course = Substitute.For<Course>();

            //Act
            _courseOperations.CreateCourse(course);

            //Assert
            _courseRepository.Received().Add(course);
        }

        [TestMethod]
        public void CreateCourse_ShouldCollaborateAsAdminForEachUserCreatorOrganizationAdminUser()
        {
            //Arrange
            var course = Substitute.For<Course>();
            var admin1 = UserObjectMother.Create();
            var admin2 = UserObjectMother.Create();
            _organizationUserRepository.GetUserOrganizationAdminUsers(course.CreatedBy)
                .Returns(new List<User>() { admin1, admin2 });

            //Act
            _courseOperations.CreateCourse(course);

            //Assert
            course.Received().CollaborateAsAdmin(admin1.Email);
            course.Received().CollaborateAsAdmin(admin2.Email);
        }

        [TestMethod]
        public void CreateCourse_ShouldRaiseCourseCreatedEvvent_WhenRaiseEventIsTrue()
        {
            //Arrange
            var course = Substitute.For<Course>();

            //Act
            _courseOperations.CreateCourse(course, true);

            //Assert
            _eventPublisher.Received().Publish(Arg.Any<CourseCreatedEvent>());
        }

        [TestMethod]
        public void CreateCourse_ShouldNotRaiseCourseCreatedEvvent_WhenRaiseEventIsFalse()
        {
            //Arrange
            var course = Substitute.For<Course>();

            //Act
            _courseOperations.CreateCourse(course, false);

            //Assert
            _eventPublisher.DidNotReceive().Publish(Arg.Any<CourseCreatedEvent>());
        }

        #endregion

    }
}
