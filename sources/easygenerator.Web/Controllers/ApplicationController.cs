using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers
{
    public class ApplicationController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }


        [HttpPost]
        public ActionResult ObjectivesJson()
        {
            var images = new[]
            {
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh4piEoOidTuAx5hiRTVtQrw2dV6sJg3J_vo2tKH4SYjg5rP9-",
                "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSquMn3u84SWcQvKAbmrlUicfv2bYY3197JsNsilftexOQYce-Z",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoYw0ETeV4XPNjE0SLiGRR2jKOtVjt4DCmWdYJt2_yHgMHR_oB",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzDuUEjJ3NjioWNqE4IGdQT1QAT_OVVLlo1OwnRVii4pYpGOzW",
                "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQnKCuTN5pOpx7CWs_LdbHdNMAsAjUW1u5XAZmgQCJMNI0OgwmDVQ",
                "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSTkgFgGAF1zPfru2bDRMOpTKPsTqtuUq5Ka27A45OdzaHnHR4V",
                "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ1lvffCujadCy9cBJwELBWaxTiG5ZO1oW1tEfyw0Av5oVi3GNu",
                "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT0v4jmJa2No5N7l6yXdoKbiAuHw2wd5gcuf6SXMrn8skoB-XV0",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFE05dLzytWrpmzdy4tjmZR19jnq5Nd3e38P6MKjOGchboVJYx7A",
                "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTLHz29e6fL5SiwUHdCFyvUkYp-nKzbsOS2Ds5T0QX0GnFQiJAv",
                "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSM3QtkWj7268L9-K-_yfLGr1OflvAsYH1ghQbqBDfuXlNA4XGgyQ",
                "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRSRM6xPgCAeAbj3A2wBF5FcJUi3gt-CsKGC82xggSKEEooHWa6",
                "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRSRM6xPgCAeAbj3A2wBF5FcJUi3gt-CsKGC82xggSKEEooHWa6",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-gf6PUwgC4qmwYSIY0kNlBZkrc8az5ADXrVRiw2v04rWXgJew1Q"
            };

            var result = new List<object>();

            for (int i = 0; i < images.Length; i++)
            {
                result.Add(new { id = i, title = "Objective " + i, image = images[i], questions = new List<object>() });
            }

            return Json(result);
        }

    }
}
