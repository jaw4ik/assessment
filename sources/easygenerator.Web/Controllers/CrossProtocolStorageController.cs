using System.Web.Mvc;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers
{
    public class CrossProtocolStorageController : Controller
    {
        [AllowAnonymous]
        [NoCache]
        public ActionResult Index()
        {
            return View();
        }
    }
}
