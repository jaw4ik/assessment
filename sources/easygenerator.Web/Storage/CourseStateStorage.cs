using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.InMemoryStorages.CourseStateStorage;

namespace easygenerator.Web.Storage
{
    public class CourseStateStorage : ICourseStateStorage
    {
        private class CourseState
        {
            public bool? IsDirty;
            public bool? IsDirtyForSale;
        }

        private readonly ICourseInfoInMemoryStorage _inMemoryStorage;
        private readonly ICourseStateRepository _repository;
        private readonly IEntityFactory _entityFactory;
        private readonly IUnitOfWork _unitOfWork;

        public CourseStateStorage(ICourseInfoInMemoryStorage inMemoryStorage, ICourseStateRepository repository, IEntityFactory entityFactory, IUnitOfWork unitOfWork)
        {
            _inMemoryStorage = inMemoryStorage;
            _repository = repository;
            _entityFactory = entityFactory;
            _unitOfWork = unitOfWork;
        }

        public bool IsDirty(Course course)
        {
            var info = _inMemoryStorage.GetCourseInfo(course);
            if (info != null)
            {
                return info.IsDirty;
            }

            info = new CourseInfo();
            var state = _repository.GetByCourseId(course.Id);
            if (state != null)
            {
                info.IsDirty = state.IsDirty;
            }

            _inMemoryStorage.SaveCourseInfo(course, info);

            return info.IsDirty;
        }

        public bool IsDirtyForSale(Course course)
        {
            var info = _inMemoryStorage.GetCourseInfo(course);
            if (info != null)
            {
                return info.IsDirtyForSale;
            }

            info = new CourseInfo();
            var state = _repository.GetByCourseId(course.Id);
            if (state != null)
            {
                info.IsDirtyForSale = state.IsDirtyForSale;
            }

            _inMemoryStorage.SaveCourseInfo(course, info);

            return info.IsDirtyForSale;
        }

        public void MarkAsDirty(Course course)
        {
            SaveCourseState(course, new CourseState()
            {
                IsDirty = true,
                IsDirtyForSale = true
            });
        }

        public void MarkAsClean(Course course)
        {
            SaveCourseState(course, new CourseState()
            {
                IsDirty = false
            });
        }

        public void MarkAsCleanForSale(Course course)
        {
            SaveCourseState(course, new CourseState()
            {
                IsDirtyForSale = false
            });
        }

        public void RemoveState(Course course)
        {
            _inMemoryStorage.RemoveCourseInfo(course);
        }

        private void SaveCourseState(Course course, CourseState courseState)
        {
            var info = _inMemoryStorage.GetCourseInfoOrDefault(course);
            if (courseState.IsDirty.HasValue)
            {
                info.IsDirty = courseState.IsDirty.Value;
            }
            if (courseState.IsDirtyForSale.HasValue)
            {
                info.IsDirtyForSale = courseState.IsDirtyForSale.Value;
            }
            _inMemoryStorage.SaveCourseInfo(course, info);

            var state = _repository.GetByCourseId(course.Id);
            if (state == null)
            {
                _repository.Add(_entityFactory.CourseState(course, info.IsDirty, info.IsDirtyForSale));
            }
            else
            {
                if (info.IsDirty || info.IsDirtyForSale)
                {
                    state.MarkAsDirty();
                }
                else
                {
                    if (!info.IsDirty)
                    {
                        state.MarkAsClean();
                    }
                    if (!info.IsDirtyForSale)
                    {
                        state.MarkAsCleanForSale();
                    }
                }
            }

            _unitOfWork.Save();
        }
    }
}