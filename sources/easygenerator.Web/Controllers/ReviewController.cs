using easygenerator.DomainModel.Entities;
using easygenerator.Web.Components;
using System;
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

            ViewBag.PublishedCourseUrl = course.PublicationUrl;
            ViewBag.CourseId = course.Id.ToString();

            return View();
        }
    }
}