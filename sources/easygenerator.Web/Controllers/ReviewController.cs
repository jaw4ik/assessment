using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Publish;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class ReviewController : DefaultController
    {
        private readonly ICoursePublishingService _publishingService;

        public ReviewController(ICoursePublishingService publishingService)
        {
            _publishingService = publishingService;
        }

        public ActionResult ReviewCourse(Course course)
        {
            if (course == null || course.PublishedOn == null)
            {
                return new HttpNotFoundResult();
            }

            ViewBag.PublishedCourseUrl = _publishingService.GetPublishedPackageUrl(course.Id.ToString());
            ViewBag.CourseId = course.Id.ToString();

            return View();
        }
    }
}