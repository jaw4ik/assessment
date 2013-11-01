using System.IO;
using easygenerator.Web.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using easygenerator.Web.Publish;
using easygenerator.Infrastructure;
using System.Net;

namespace easygenerator.Web.Controllers
{
    [AllowAnonymous]
    public class PublishedPackageController : DefaultController
    {
        private readonly IExperiencePublisher _experiencePublisher;
        private readonly PhysicalFileManager _physicalFileManager;
        public PublishedPackageController(IExperiencePublisher experiencePublisher, PhysicalFileManager physicalFileManager)
        {
            _experiencePublisher = experiencePublisher;
            _physicalFileManager = physicalFileManager;
        }

        public ActionResult GetPublishedResource(string packageId, string resourceUrl)
        {
            string resourcePath = GetPublishedResourcePath(packageId, resourceUrl);
            var filePath = _experiencePublisher.GetPublishedResourcePhysicalPath(resourcePath);
            if (!_physicalFileManager.FileExists(filePath))
            {
                return new HttpStatusCodeResult(HttpStatusCode.NotFound);
            }

            return File(filePath, _physicalFileManager.GetFileContentType(filePath));
        }

        private string GetPublishedResourcePath(string packageId, string resourceUrl)
        {
            if (string.IsNullOrWhiteSpace(resourceUrl))
                resourceUrl = "index.html";

            Guid packageGuid = Guid.Empty;
            if (!Guid.TryParse(packageId, out packageGuid))
            {
                if (HttpContext.Request.UrlReferrer != null && HttpContext.Request.UrlReferrer.Segments.Length > 0)
                {
                    string guid = HttpContext.Request.UrlReferrer.Segments[HttpContext.Request.UrlReferrer.Segments.Length - 1];
                    return string.Format("{0}/{1}/{2}", guid, packageId, resourceUrl);
                }
            }

            return string.Format("{0}/{1}", packageId, resourceUrl);
        }
    }
}