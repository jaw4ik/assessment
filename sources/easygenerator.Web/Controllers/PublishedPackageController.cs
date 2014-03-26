using System.IO;
using System.Web.Routing;
using easygenerator.Web.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Publish;
using easygenerator.Infrastructure;
using System.Net;
using easygenerator.Web.Components.ActionFilters;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    [NoCache]
    public class PublishedPackageController : DefaultController
    {
        private readonly ICoursePublishingService _coursePublishingService;
        private readonly PhysicalFileManager _physicalFileManager;
        public PublishedPackageController(ICoursePublishingService coursePublishingService, PhysicalFileManager physicalFileManager)
        {
            _coursePublishingService = coursePublishingService;
            _physicalFileManager = physicalFileManager;
        }

        public ActionResult GetPublishedResource(string packageId, string resourceUrl)
        {
            // redirect to correct url, should contain '/' in the end, to correctly process links to package files.
            if (string.IsNullOrEmpty(resourceUrl))
            {
                if (HttpContext != null && HttpContext.Request != null && HttpContext.Request.Url != null)
                {
                    if (!HttpContext.Request.Url.AbsolutePath.EndsWith("/"))
                    {
                        return Redirect(_coursePublishingService.GetPublishedPackageUrl(packageId));
                    }
                }
                else
                {
                    return new EmptyResult();
                }
            }

            string resourcePath = string.Format("{0}/{1}", packageId, string.IsNullOrWhiteSpace(resourceUrl) ? "index.html" : resourceUrl);
            var filePath = _coursePublishingService.GetPublishedResourcePhysicalPath(resourcePath);
            if (!_physicalFileManager.FileExists(filePath))
            {
                return new HttpStatusCodeResult(HttpStatusCode.NotFound);
            }

            return File(filePath, MimeMapping.GetMimeMapping(filePath));
        }
    }
}