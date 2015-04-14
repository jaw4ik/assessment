
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.DomainModel.Tests.ObjectMothers;
using easygenerator.Infrastructure;
using easygenerator.Web.DomainEvents.ChangeTracking;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;

namespace easygenerator.Web.Tests.DomainEvents.ChangeTracking
{
    [TestClass]
    public class CourseStateStorageTests
    {
        private CourseStateStorage _infoStorage;
        private ICourseStateInMemoryStorage _inMemoryStorage;
        private ICourseStateRepository _repository;
        private IEntityFactory _entityFactory;
        private IUnitOfWork _unitOfWork;

        [TestInitialize]
        public void Initialize()
        {
            _inMemoryStorage = Substitute.For<ICourseStateInMemoryStorage>();
            _repository = Substitute.For<ICourseStateRepository>();
            _entityFactory = Substitute.For<IEntityFactory>();
            _unitOfWork = Substitute.For<IUnitOfWork>();
            _infoStorage = new CourseStateStorage(_inMemoryStorage, _repository, _entityFactory, _unitOfWork);
        }

        #region HasUnpublishedChanges

        [TestMethod]
        public void HasUnpublishedChanges_Should_ReturnInMemoryValue_WhenValueIsInMemory()
        {
            //Arrange
            var inMemoryValue = true;
            var course = CourseObjectMother.Create();
            _inMemoryStorage.TryGetHasUnpublishedChanges(course, out inMemoryValue).ReturnsForAnyArgs(x =>
            {
                x[1] = inMemoryValue;
                return true;
            });

            //Act
            var result = _infoStorage.HasUnpublishedChanges(course);

            //Assert
            Assert.AreEqual(result, inMemoryValue);
        }

        [TestMethod]
        public void HasUnpublishedChanges_Should_ReturntValueFromRepository_WhenValueIsNotInMemory_AndValueIsInRepository()
        {
            //Arrange
            var inMemoryValue = false;
            var course = CourseObjectMother.Create();
            _inMemoryStorage.TryGetHasUnpublishedChanges(course, out inMemoryValue).ReturnsForAnyArgs(x =>
            {
                x[1] = inMemoryValue;
                return false;
            });

            _repository.GetByCourseId(course.Id).Returns(CourseStateObjectMother.Create(course, true));

            //Act
            var result = _infoStorage.HasUnpublishedChanges(course);

            //Assert
            Assert.IsTrue(result);
        }

        [TestMethod]
        public void HasUnpublishedChanges_Should_ReturntFalse_WhenValueIsNotInMemory_AndValueIsNotInRepository()
        {
            //Arrange
            var inMemoryValue = false;
            var course = CourseObjectMother.Create();
            _inMemoryStorage.TryGetHasUnpublishedChanges(course, out inMemoryValue).ReturnsForAnyArgs(x =>
            {
                x[1] = inMemoryValue;
                return false;
            });

            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            var result = _infoStorage.HasUnpublishedChanges(course);

            //Assert
            Assert.IsFalse(result);
        }

        [TestMethod]
        public void HasUnpublishedChanges_Should_SaveRepositoryValueInMemory_WhenValueIsNotInMemory_AndValueIsInRepository()
        {
            //Arrange
            var inMemoryValue = false;
            var course = CourseObjectMother.Create();
            _inMemoryStorage.TryGetHasUnpublishedChanges(course, out inMemoryValue).ReturnsForAnyArgs(x =>
            {
                x[1] = inMemoryValue;
                return false;
            });

            _repository.GetByCourseId(course.Id).Returns(CourseStateObjectMother.Create(course, true));

            //Act
            _infoStorage.HasUnpublishedChanges(course);

            //Assert
            _inMemoryStorage.Received().SaveHasUnpublishedChanges(course, true);
        }

        [TestMethod]
        public void HasUnpublishedChanges_Should_SaveFalseInMemory_WhenValueIsNotInMemory_AndValueIsNotInRepository()
        {
            //Arrange
            var inMemoryValue = false;
            var course = CourseObjectMother.Create();
            _inMemoryStorage.TryGetHasUnpublishedChanges(course, out inMemoryValue).ReturnsForAnyArgs(x =>
            {
                x[1] = inMemoryValue;
                return false;
            });

            _repository.GetByCourseId(course.Id).Returns(null as CourseState);

            //Act
            _infoStorage.HasUnpublishedChanges(course);

            //Assert
            _inMemoryStorage.Received().SaveHasUnpublishedChanges(course, false);
        }

        #endregion

        #region SaveHasUnpublishedChanges

        [TestMethod]
        public void SaveHasUnpublishedChanges_Should_SaveValueToMemory()
        {
            //Arrange
            var course = CourseObjectMother.Create();

            //Act
            _infoStorage.SaveHasUnpublishedChanges(course, true);

            //Assert
            _inMemoryStorage.Received().SaveHasUnpublishedChanges(course, true);
        }

        [TestMethod]
        public void SaveHasUnpublishedChanges_Should_AddValueToRepository_WhenValueIsNotInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var state = CourseStateObjectMother.Create();
            _repository.GetByCourseId(course.Id).Returns(null as CourseState);
            _entityFactory.CourseState(course, true).ReturnsForAnyArgs(state);

            //Act
            _infoStorage.SaveHasUnpublishedChanges(course, true);

            //Assert
            _repository.Received().Add(state);
        }

        [TestMethod]
        public void SaveHasUnpublishedChanges_Should_UpdateValueInRepository_WhenValueIsInRepository()
        {
            //Arrange
            var course = CourseObjectMother.Create();
            var state = Substitute.For<CourseState>();
            _repository.GetByCourseId(course.Id).Returns(state);

            //Act
            _infoStorage.SaveHasUnpublishedChanges(course, true);

            //Assert
            state.Received().UpdateHasUnpublishedChanges(true);
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
            _infoStorage.RemoveCourseState(course);

            //Assert
            _inMemoryStorage.Received().RemoveCourseState(course);
        }

        #endregion

    }
}
