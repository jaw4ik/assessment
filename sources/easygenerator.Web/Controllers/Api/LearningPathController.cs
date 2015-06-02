using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Mappers;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers.Api
{
    public class LearningPathController : DefaultApiController
    {
        private readonly ILearningPathRepository _repository;
        private readonly IEntityModelMapper<LearningPath> _mapper;
        private readonly IEntityFactory _entityFactory;

        public LearningPathController(ILearningPathRepository repository, IEntityModelMapper<LearningPath> mapper, IEntityFactory entityFactory)
        {
            _repository = repository;
            _mapper = mapper;
            _entityFactory = entityFactory;
        }

        [HttpPost]
        [Route("api/learningpath/create")]
        public ActionResult Create(string title)
        {
            var learningPath = _entityFactory.LearningPath(title, GetCurrentUsername());
            _repository.Add(learningPath);

            return JsonSuccess(_mapper.Map(learningPath));
        }

        [HttpPost]
        [Route("api/learningpaths")]
        public ActionResult GetCollection()
        {
            var username = GetCurrentUsername();
            var learningPaths = _repository.GetCollection(e => e.CreatedBy == username);
            var data = learningPaths.Select(e => _mapper.Map(e));

            return JsonSuccess(data);
        }

        [HttpPost]
        [Route("api/learningpath/title/update")]
        public ActionResult UpdateTitle(LearningPath learningPath, string title)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            learningPath.UpdateTitle(title, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/course/add")]
        public ActionResult AddCourse(LearningPath learningPath, Course course, int? index)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            learningPath.AddCourse(course, index, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/course/remove")]
        public ActionResult RemoveCourse(LearningPath learningPath, Course course)
        {
            if (learningPath == null)
            {
                return JsonLocalizableError(Errors.LearningPathNotFoundError, Errors.LearningPathNotFoundResourceKey);
            }

            if (course == null)
            {
                return JsonLocalizableError(Errors.CourseNotFoundError, Errors.CourseNotFoundResourceKey);
            }

            learningPath.RemoveCourse(course, GetCurrentUsername());

            return JsonSuccess();
        }

        [HttpPost]
        [Route("api/learningpath/courses/order/update")]
        public ActionResult UpdateCourseOrder(LearningPath learningPath, ICollection<Course> courses)
        {
            if (learningPath == null)
            {
                return HttpNotFound(Errors.LearningPathNotFoundError);
            }

            learningPath.UpdateCoursesOrder(courses, GetCurrentUsername());

            return JsonSuccess();
        }


    }
}