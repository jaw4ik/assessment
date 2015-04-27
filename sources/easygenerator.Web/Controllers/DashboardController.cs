using System.Linq;
using System.Web.Mvc;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionFilters.Authorization;
using easygenerator.Web.Synchronization.Tracking;
using easygenerator.Web.ViewModels.Dashboard;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    [AllowedUsers("dashboard.allowedUsers")]
    public class DashboardController : DefaultController
    {
        [HttpGet]
        [Route("dashboard")]
        public ActionResult Index()
        {
            return View(new DashboardViewModel(UserConnectionTracker.Instance.GetConnectionsCount(), UserConnectionTracker.Instance.GetOnlineUsersCollection()));
        }
    }
}