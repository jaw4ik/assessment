using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.InMemoryStorages;

namespace easygenerator.Web.DomainEvents.ChangeTracking
{
    public class CourseStateInfoStorage : ICourseStateInfoStorage
    {
        private readonly ICourseStateInfoInMemoryStorage _inMemoryStorage;
        private readonly ICourseStateRepository _repository;
        private readonly IEntityFactory _entityFactory;
        private readonly IUnitOfWork _unitOfWork;

        public CourseStateInfoStorage(ICourseStateInfoInMemoryStorage inMemoryStorage, ICourseStateRepository repository, IEntityFactory entityFactory, IUnitOfWork unitOfWork)
        {
            _inMemoryStorage = inMemoryStorage;
            _repository = repository;
            _entityFactory = entityFactory;
            _unitOfWork = unitOfWork;
        }

        public CourseStateInfo GetCourseStateInfo(Course course)
        {
            var stateInfo = _inMemoryStorage.GetCourseStateInfo(course);
            if (stateInfo != null)
            {
                return stateInfo;
            }

            var state = _repository.GetByCourseId(course.Id);
            if (state == null)
            {
                return _entityFactory.CourseStateInfo(false);
            }

            _inMemoryStorage.SaveCourseStateInfo(course, state.Info);
            return state.Info;
        }

        public void SaveCourseStateInfo(Course course, CourseStateInfo stateInfo)
        {
            _inMemoryStorage.SaveCourseStateInfo(course, stateInfo);

            var state = _repository.GetByCourseId(course.Id);
            if (state == null)
            {
                _repository.Add(_entityFactory.CourseState(course, stateInfo));
            }
            else
            {
                state.UpdateInfo(stateInfo);
            }

            _unitOfWork.Save();
        }

        public void RemoveCourseStateInfo(Course course)
        {
            _inMemoryStorage.RemoveCourseStateInfo(course);
        }
    }
}