using easygenerator.DomainModel.Entities;
using easygenerator.Web.Components;
using System;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class ReviewController : DefaultController
    {
        public ActionResult ReviewCourse(Course course)
        {
            if (course == null || course.PublishedOn == null || String.IsNullOrEmpty(course.PublicationUrl))
            {
                return new HttpNotFoundResult();
            }

            var reviewApiUrl = $"{Request.Url.Scheme}://{Request.Url.Authority}";
            ViewBag.PublishedCourseUrl = $"{course.PublicationUrl}?reviewApiUrl={Server.UrlEncode(reviewApiUrl)}";
            ViewBag.CourseId = course.Id.ToString();

            return View();
        }
    }
}