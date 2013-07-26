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
        private string[] images = new[]
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

        private const string symbols = "De ä ö ü ß Es Ñ ¿é ú? ó á ¡Hola! Fr Àà, Ââ, Ææ Çç Éé, Èè, Êê Ëë Îî, Ïï Ôô, Œœ Ùù, Ûû, Üü ŸÿЁ!\"№№;%:?*()_+Ъ,/~_+{}:\"|<>?|`-=[[]]\';/,.";

        public ActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public ActionResult ApplicationData()
        {
            var questions = new List<object>();

            for (int i = 0; i < 10; i++)
            {
                questions.Add(
                    new
                    {
                        id = i,
                        title = "Question " + i,
                        answerOptions = new[]
                            {
                                new { id = 0, isCorrect = true, text = "lalala" }, 
                                new { id = 1, isCorrect = false, text = "tololo" }, 
                                new { id = 2, isCorrect = true, text = "One of the major benefits to using CSS for layout is that you can design your Web page and then put the HTML together so that the most important content comes first. This is important for SEO because most search engines weight the content towards the top of the page more than content towards the bottom. Search engines do this because they are not human. They cant just look at a Web page design and pick out the most important part. They are programmed to read HTML, while we look at the results of the HTML." }
                            },
                        explanations = new[]
                            {
                                new {id=0, text="<h1>Some h1 De ä ö ü ß Es Ñ ¿é ú? ó á ¡Hola! Fr Àà, Ââ, Ææ Çç Éé, Èè, Êê Ëë Îî, Ïï Ôô, Œœ Ùù, Ûû, Üü ŸÿЁ!\"№№;%:?*()_+Ъ,/~_+{}:\"|<>?|`-=[[]]\';/,. tag</h1>"},
                                new {id=1, text="<iframe width=\"560\" height=\"315\" src=\"//www.youtube.com/embed/sI0osns8iUI?list=UUzLrv9dut1RjUk7eeSAfJrQ\" frameborder=\"0\" allowfullscreen></iframe>"},
                                new {id=2, text="One of the major benefits to using CSS for layout is that you can design your Web page and then put the HTML together so that the most important content comes first. This is important for SEO because most search engines weight the content towards the top of the page more than content towards the bottom. Search engines do this because they are not human. They cant just look at a Web page design and pick out the most important part. They are programmed to read HTML, while we look at the results of the HTML."}
                            }
                    });
            }

            var objectives = new List<object>();
            for (int i = 0; i < 10; i++)
            {
                objectives.Add(new { id = i, title = "Objective " + i, image = images[i], questions = questions });
            }
            objectives.Add(new { id = objectives.Count(), title = "Objective with symbols: " + symbols, image = images[0], questions = questions });
            objectives.Add(new { id = objectives.Count(), title = new string('*', 255), image = images[0], questions = questions });

            var experiences = new List<object>();
            for (int i = 0; i < 10; i++)
            {
                experiences.Add(new { id = i, title = "Experience " + i });
            }
            experiences.Add(new { id = experiences.Count(), title = "Experience with symbols: " + symbols });
            experiences.Add(new { id = experiences.Count(), title = new string('*', 255) });

            return Json(new
            {
                objectives = objectives,
                experiences = experiences
            }, JsonRequestBehavior.AllowGet);
        }

    }
}
