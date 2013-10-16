using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    public class HelpHintController : DefaultController
    {
        private readonly IHelpHintRepository _repository;
        private readonly IEntityFactory _entityFactory;

        public HelpHintController(IHelpHintRepository repository, IEntityFactory entityFactory)
        {
            _repository = repository;
            _entityFactory = entityFactory;
        }

        [HttpPost]
        public ActionResult GetCollection()
        {
            var helpHints = _repository.GetHelpHintsForUser(GetCurrentUsername()).Select(hh => new
            {
                Id = hh.Id.ToString("N"),
                Name = hh.Name,
            });

            return JsonSuccess(new { HelpHints = helpHints });
        }

        [HttpPost]
        public ActionResult HideHint(HelpHint hint)
        {
            if (hint == null)
            {
                return JsonLocalizableError(Constants.Errors.HelpHintNotFoundError, Constants.Errors.HelpHintNotFoundResourceKey);
            }

            _repository.HideHint(hint);
            return JsonSuccess();
        }

        [HttpPost]
        public ActionResult ShowHint(string hintKey)
        {
            var hint = _entityFactory.HelpHint(hintKey, GetCurrentUsername());
            _repository.ShowHint(hint);

            return JsonSuccess(new
            {
                Id = hint.Id.ToString("N"),
                Name = hint.Name,
            });
        }
    }
}
