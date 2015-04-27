using easygenerator.DomainModel.Entities;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using System;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    [NoCache]
    public class RedirectToNewStorageController : DefaultController
    {
        public ActionResult RedirectToNewUrl(Course course, string resourceUrl)
        {
            if (course == null || course.PublishedOn == null || String.IsNullOrEmpty(course.PublicationUrl) ||
                !(string.IsNullOrWhiteSpace(resourceUrl) || string.Equals(resourceUrl, "index.html", StringComparison.CurrentCultureIgnoreCase)))
            {
                return new HttpNotFoundResult();
            }

            return RedirectPermanent(course.PublicationUrl);
        }
    }
}