using System.Web.Mvc;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers.Api
{
    [NoCache]
    public class ReleaseNoteController : DefaultController
    {
        private readonly IReleaseNoteFileReader _releaseNoteFileReader;

        public ReleaseNoteController(IReleaseNoteFileReader releaseNoteFileReader)
        {
            _releaseNoteFileReader = releaseNoteFileReader;
        }

        [HttpPost]
        [Route("api/releasenote/get")]
        public ActionResult GetReleaseNote()
        {
            return JsonSuccess(_releaseNoteFileReader.Read());
        }
    }
}