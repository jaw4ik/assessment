using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
using easygenerator.Web.Storage;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.Storage
{
    [TestClass]
    public class CourseStateStorageTests
    {
        private CourseStateStorage _infoStorage;
        private ICourseInfoInMemoryStorage _inMemoryStorage;
        private ICourseStateRepository _repository;
        private IEntityFactory _entityFactory;
        private IUnitOfWork _unitOfWork;

        [TestInitialize]
        public void Initialize()
        {
            _inMemoryStorage = Substitute.For<ICourseInfoInMemoryStorage>();
            _repository = Substitute.For<ICourseStateRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _infoStorage = new CourseStateStorage(_inMemoryStorage, _repository, _entityFactory, _unitOfWork);
        }

        #region IsDirty

        [TestMethod]
        public void IsDirty_Should_ReturnInMemoryValue_WhenValueIsInMemory()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo { IsDirty = true };
            _inMemoryStorage.GetCourseInfo(course).Returns(info);

            //Act
            var result = _infoStorage.IsDirty(course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsDirty_Should_ReturntValueFromRepository_WhenValueIsNotInMemory_AndValueIsInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _inMemoryStorage.GetCourseInfo(course).Returns(null as CourseInfo);

            _repository.GetByCourseId(course.Id).Returns(CourseStateObjectMother.Create(course, true));

            //Act
            var result = _infoStorage.IsDirty(course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsDirty_Should_ReturntFalse_WhenValueIsNotInMemory_AndValueIsNotInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _inMemoryStorage.GetCourseInfo(course).Returns(null as CourseInfo);

            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            var result = _infoStorage.IsDirty(course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsDirty_Should_SaveRepositoryValueInMemory_WhenValueIsNotInMemory_AndValueIsInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfo(course).Returns(null as CourseInfo);

            _repository.GetByCourseId(course.Id).Returns(CourseStateObjectMother.Create(course, true));

            //Act
            _infoStorage.IsDirty(course);

            //Assert
            _inMemoryStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        [TestMethod]
        public void IsDirty_Should_SaveValueToMemory_WhenValueIsNotInMemory_AndValueIsNotInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfo(course).Returns(null as CourseInfo);
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            _infoStorage.IsDirty(course);

            //Assert
            _inMemoryStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        #endregion

        #region IsDirtyForSale

        [TestMethod]
        public void IsDirtyForSale_Should_ReturnInMemoryValue_WhenValueIsInMemory()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo { IsDirtyForSale = true };
            _inMemoryStorage.GetCourseInfo(course).Returns(info);

            //Act
            var result = _infoStorage.IsDirtyForSale(course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsDirtyForSale_Should_ReturntValueFromRepository_WhenValueIsNotInMemory_AndValueIsInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _inMemoryStorage.GetCourseInfo(course).Returns(null as CourseInfo);

            _repository.GetByCourseId(course.Id).Returns(CourseStateObjectMother.Create(course, false, true));

            //Act
            var result = _infoStorage.IsDirtyForSale(course);

            //Assert
            result.Should().BeTrue();
        }

        [TestMethod]
        public void IsDirtyForSale_Should_ReturntFalse_WhenValueIsNotInMemory_AndValueIsNotInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            _inMemoryStorage.GetCourseInfo(course).Returns(null as CourseInfo);

            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            var result = _infoStorage.IsDirtyForSale(course);

            //Assert
            result.Should().BeFalse();
        }

        [TestMethod]
        public void IsDirtyForSale_Should_SaveRepositoryValueInMemory_WhenValueIsNotInMemory_AndValueIsInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfo(course).Returns(null as CourseInfo);

            _repository.GetByCourseId(course.Id).Returns(CourseStateObjectMother.Create(course, true));

            //Act
            _infoStorage.IsDirtyForSale(course);

            //Assert
            _inMemoryStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        [TestMethod]
        public void IsDirtyForSale_Should_SaveValueToMemory_WhenValueIsNotInMemory_AndValueIsNotInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfo(course).Returns(null as CourseInfo);
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            _infoStorage.IsDirtyForSale(course);

            //Assert
            _inMemoryStorage.ReceivedWithAnyArgs().SaveCourseInfo(course, info);
        }

        #endregion

        #region MarkAsDirty

        [TestMethod]
        public void MarkAsDirty_Should_SaveValueToMemory()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            //Act
            _infoStorage.MarkAsDirty(course);

            //Assert
            _inMemoryStorage.Received().SaveCourseInfo(course, info);
        }

        [TestMethod]
        public void MarkAsDirty_Should_AddValueToRepository_WhenValueIsNotInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            var state = CourseStateObjectMother.Create();
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);
            _entityFactory.CourseState(course, true, true).ReturnsForAnyArgs(state);

            //Act
            _infoStorage.MarkAsDirty(course);

            //Assert
            _repository.Received().Add(state);
        }

        [TestMethod]
        public void MarkAsDirty_Should_UpdateValueInRepository_WhenValueIsInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            var state = Substitute.For<CourseState>();
            _repository.GetByCourseId(course.Id).Returns(state);

            //Act
            _infoStorage.MarkAsDirty(course);

            //Assert
            state.Received().MarkAsDirty();
            _unitOfWork.Received().Save();
        }

        #endregion

        #region MarkAsClean

        [TestMethod]
        public void MarkAsClean_Should_SaveValueToMemory()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            //Act
            _infoStorage.MarkAsClean(course);

            //Assert
            _inMemoryStorage.Received().SaveCourseInfo(course, info);
        }

        [TestMethod]
        public void MarkAsClean_Should_AddValueToRepository_WhenValueIsNotInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            var state = CourseStateObjectMother.Create();
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);
            _entityFactory.CourseState(course, true, true).ReturnsForAnyArgs(state);

            //Act
            _infoStorage.MarkAsClean(course);

            //Assert
            _repository.Received().Add(state);
        }

        [TestMethod]
        public void MarkAsClean_Should_UpdateValueInRepository_WhenValueIsInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            var state = Substitute.For<CourseState>();
            _repository.GetByCourseId(course.Id).Returns(state);

            //Act
            _infoStorage.MarkAsClean(course);

            //Assert
            state.Received().MarkAsClean();
            _unitOfWork.Received().Save();
        }

        #endregion

        #region MarkAsCleanForSale

        [TestMethod]
        public void MarkAsCleanForSale_Should_SaveValueToMemory()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            //Act
            _infoStorage.MarkAsCleanForSale(course);

            //Assert
            _inMemoryStorage.Received().SaveCourseInfo(course, info);
        }

        [TestMethod]
        public void MarkAsCleanForSale_Should_AddValueToRepository_WhenValueIsNotInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            var state = CourseStateObjectMother.Create();
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);
            _entityFactory.CourseState(course, true, true).ReturnsForAnyArgs(state);

            //Act
            _infoStorage.MarkAsCleanForSale(course);

            //Assert
            _repository.Received().Add(state);
        }

        [TestMethod]
        public void MarkAsCleanForSale_Should_UpdateValueInRepository_WhenValueIsInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = new CourseInfo();
            _inMemoryStorage.GetCourseInfoOrDefault(course).Returns(info);

            var state = Substitute.For<CourseState>();
            _repository.GetByCourseId(course.Id).Returns(state);

            //Act
            _infoStorage.MarkAsCleanForSale(course);

            //Assert
            state.Received().MarkAsClean();
            _unitOfWork.Received().Save();
        }

        #endregion

        #region RemoveCourseStateInfo

        [TestMethod]
        public void RemoveCourseStateInfo_Should_CallInMemoryStorageRemoveCourseState()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _infoStorage.RemoveState(course);

            //Assert
            _inMemoryStorage.Received().RemoveCourseInfo(course);
        }

        #endregion

    }
}
