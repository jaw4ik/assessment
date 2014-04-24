using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Publish;
using System.Net;
using System.Web;
using System.Web.Mvc;

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

        [ResourceUrlProcessor]
        public ActionResult GetPublishedResource(string packageId, string resourceUrl)
        {
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