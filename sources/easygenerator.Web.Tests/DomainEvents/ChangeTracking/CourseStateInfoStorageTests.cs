
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.DomainEvents.ChangeTracking;
using easygenerator.Web.InMemoryStorages;
using easygenerator.Web.Tests.Utils;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking
{
    [TestClass]
    public class CourseStateInfoStorageTests
    {
        private CourseStateInfoStorage _storage;
        private ICourseStateInfoInMemoryStorage _inMemoryStorage;
        private ICourseStateRepository _repository;
        private IEntityFactory _entityFactory;
        private IUnitOfWork _unitOfWork;

        [TestInitialize]
        public void Initialize()
        {
            _inMemoryStorage = Substitute.For<ICourseStateInfoInMemoryStorage>();
            _repository = Substitute.For<ICourseStateRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _storage = new CourseStateInfoStorage(_inMemoryStorage, _repository, _entityFactory, _unitOfWork);
        }

        #region GetCourseStateInfo

        [TestMethod]
        public void GetCourseStateInfo_Should_ReturnCourseState_When_StatePresentInMemoryStorage()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            _inMemoryStorage.GetCourseStateInfo(course).Returns(info);

            //Act
            var result = _storage.GetCourseStateInfo(course);

            //Assert
            result.Should().Be(info);
        }

        [TestMethod]
        public void GetCourseStateInfo_Should_ReturnCourseStateFromRepository_When_StateIsNotPresentInMemoryStorage_And_StatePresentInRepository()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            var state = CourseStateObjectMother.Create(course, info);
            _inMemoryStorage.GetCourseStateInfo(course).Returns(null as CourseStateInfo);
            _repository.GetByCourseId(course.Id).Returns(state);

            //Act
            var result = _storage.GetCourseStateInfo(course);

            //Assert
            result.Should().Be(info);
        }

        [TestMethod]
        public void GetCourseStateInfo_Should_SaveStateInfoToMemoryStorage_When_StateIsNotPresentInMemoryStorage_And_StatePresentInRepository()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            var state = CourseStateObjectMother.Create(course, info);
            _inMemoryStorage.GetCourseStateInfo(course).Returns(null as CourseStateInfo);
            _repository.GetByCourseId(course.Id).Returns(state);

            //Act
            _storage.GetCourseStateInfo(course);

            //Assert
            _inMemoryStorage.Received().SaveCourseStateInfo(course, info);
        }

        [TestMethod]
        public void GetCourseStateInfo_ShouldNot_SaveStateInfoToMemoryStorage_When_StateIsNotPresentInMemoryStorage_And_StatePresentInRepository()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            _inMemoryStorage.GetCourseStateInfo(course).Returns(null as CourseStateInfo);
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            _storage.GetCourseStateInfo(course);

            //Assert
            _inMemoryStorage.DidNotReceiveWithAnyArgs().SaveCourseStateInfo(course, info);
        }

        [TestMethod]
        public void GetCourseStateInfo_Should_ReturnNewCourseStateInfo_When_StateIsNotPresentInMemoryStorage_And_StateIsNotPresentInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var info = CourseStateInfoObjectMother.Create();
            _inMemoryStorage.GetCourseStateInfo(course).Returns(null as CourseStateInfo);
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);
            _entityFactory.CourseStateInfo(false).Returns(info);

            //Act
            var result = _storage.GetCourseStateInfo(course);

            //Assert
            Assert.IsNotNull(result);
            result.Should().BeOfType<CourseStateInfo>();
        }

        #endregion GetCourseStateInfo

        #region SaveCourseStateInfo

        [TestMethod]
        public void SaveCourseStateInfo_Should_CallInMemoryStorageSaveCourseState()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();

            //Act
            _storage.SaveCourseStateInfo(course, info);

            //Assert
            _inMemoryStorage.Received().SaveCourseStateInfo(course, info);
        }

        [TestMethod]
        public void SaveCourseStateInfo_Should_AddCourseStateToRepository_WhenCourseStateIsNotInRepository()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            var state = CourseStateObjectMother.Create(course, info);
            _entityFactory.CourseState(course, info).Returns(state);
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            _storage.SaveCourseStateInfo(course, info);

            //Assert
            _repository.Received().Add(state);
        }

        [TestMethod]
        public void SaveCourseStateInfo_Should_SaveData_WhenCourseStateIsNotInRepository()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            var state = CourseStateObjectMother.Create(course, info);
            _entityFactory.CourseState(course, info).Returns(state);
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            _storage.SaveCourseStateInfo(course, info);

            //Assert
            _unitOfWork.Received().Save();
        }

        [TestMethod]
        public void SaveCourseStateInfo_Should_UpdateCourseStateInfo_WhenCourseStateIsInRepository()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var newInfo = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            var state = CourseStateObjectMother.Create(course, info);
            _repository.GetByCourseId(course.Id).Returns(state);

            //Act
            _storage.SaveCourseStateInfo(course, newInfo);

            //Assert
            state.Info.HasUnpublishedChanges.ShouldBeSimilar(newInfo.HasUnpublishedChanges);
        }

        [TestMethod]
        public void SaveCourseStateInfo_Should_SaveData_WhenCourseStateIsInRepository()
        {
            //Arrange
            var info = CourseStateInfoObjectMother.Create();
            var newInfo = CourseStateInfoObjectMother.Create();
            var course = CourseObjectMother.Create();
            var state = CourseStateObjectMother.Create(course, info);
            _repository.GetByCourseId(course.Id).Returns(state);

            //Act
            _storage.SaveCourseStateInfo(course, newInfo);

            //Assert
            _unitOfWork.Received().Save();
        }

        #endregion SaveCourseStateInfo

        #region RemoveCourseStateInfo

        [TestMethod]
        public void RemoveCourseStateInfo_Should_CallInMemoryStorageRemoveCourseState()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _storage.RemoveCourseStateInfo(course);

            //Assert
            _inMemoryStorage.Received().RemoveCourseStateInfo(course);
        }

        #endregion RemoveCourseStateInfo

    }
}
