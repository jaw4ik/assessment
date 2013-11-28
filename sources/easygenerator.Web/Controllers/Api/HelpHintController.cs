using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
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
            if (hint != null)
            {
                _repository.HideHint(hint);
            }

            return JsonSuccess();
        }

        [HttpPost]
        public ActionResult ShowHint(string hintKey)
        {
            var hint = _repository.GetHelpHintsForUser(GetCurrentUsername()).SingleOrDefault(h => h.Name == hintKey);

            if (hint == null)
            {
                hint = _entityFactory.HelpHint(hintKey, GetCurrentUsername());
                _repository.ShowHint(hint);
            }

            return JsonSuccess(new
            {
                Id = hint.Id.ToString("N"),
                Name = hint.Name,
            });
        }
    }
}
