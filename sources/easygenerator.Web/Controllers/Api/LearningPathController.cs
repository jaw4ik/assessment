using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Mappers;
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
            var data = learningPaths.OrderByDescending(i => i.CreatedOn).Select(e => _mapper.Map(e));

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

    }
}