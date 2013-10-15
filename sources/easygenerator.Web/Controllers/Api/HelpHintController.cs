using System.Linq;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Components;

namespace easygenerator.Web.Controllers.Api
{
    public class HelpHintController : DefaultController
    {
        private readonly IHelpHintRepository _repository;

        public HelpHintController(IHelpHintRepository repository)
        {
            _repository = repository;
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
                return JsonError("Hint not found");
            }

            _repository.HideHint(hint);
            return JsonSuccess();
        }
    }
}
