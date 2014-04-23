﻿using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildCourse;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Extensions;
using easygenerator.Web.Preview;
using System;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    public class PreviewController : Controller
    {
        private readonly ICoursePreviewBuilder _coursePreviewBuilder;
        private readonly BuildPathProvider _pathProvider;
        private readonly IUrlHelperWrapper _urlHelper;
        private readonly PhysicalFileManager _physicalFileManager;

        public PreviewController(ICoursePreviewBuilder coursePreviewBuilder,
                                 BuildPathProvider pathProvider,
                                 IUrlHelperWrapper urlHelper,
                                 PhysicalFileManager physicalFileManager)
        {
            _coursePreviewBuilder = coursePreviewBuilder;
            _pathProvider = pathProvider;
            _urlHelper = urlHelper;
            _physicalFileManager = physicalFileManager;
        }

        [Route("preview/{courseId}")]
        public ActionResult PreviewCourse(Course course)
        {
            if (course == null)
            {
                return new HttpNotFoundResult();
            }

            ViewBag.Url = GetPreviewBuildUrl(course.Id);
            return View();
        }

        [HttpPost]
        [Route("preview/build/{courseId}")]
        public async Task<ActionResult> BuildCoursePreview(Course course)
        {
            if (course == null)
            {
                return new HttpNotFoundResult();
            }

            var buildSuccess = await _coursePreviewBuilder.Build(course);

            if (!buildSuccess)
            {
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError);
            }

            return new JsonResult()
            {
                Data = GetPreviewUrl(course.Id.ToString())
            };
        }

        [Route("storage/preview/{courseId}/{*resourceUrl}")]
        public ActionResult GetPreviewResource(string courseId, string resourceUrl)
        {
            // redirect to correct url, should contain '/' in the end, to correctly process links to package files.
            if (string.IsNullOrEmpty(resourceUrl))
            {
                if (HttpContext != null && HttpContext.Request != null && HttpContext.Request.Url != null)
                {
                    if (!HttpContext.Request.Url.AbsolutePath.EndsWith("/"))
                    {
                        return Redirect(GetPreviewUrl(courseId));
                    }
                }
                else
                {
                    return new EmptyResult();
                }
            }

            string resourcePath = string.Format("{0}/{1}", courseId, string.IsNullOrWhiteSpace(resourceUrl) ? "index.html" : resourceUrl);
            var filePath = GetPreviewResourcePhysicalPath(resourcePath);
            if (!_physicalFileManager.FileExists(filePath))
            {
                return new HttpNotFoundResult();
            }

            return File(filePath, MimeMapping.GetMimeMapping(filePath));
        }

        private string GetPreviewUrl(string courseId)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format("~/storage/preview/{0}/", courseId));
        }

        private string GetPreviewBuildUrl(Guid courseId)
        {
            return _urlHelper.ToAbsoluteUrl(string.Format("~/preview/build/{0}/", courseId.ToNString()));
        }

        public string GetPreviewResourcePhysicalPath(string resourceUrl)
        {
            return _pathProvider.GetPreviewResourcePath(resourceUrl.Replace("/", "\\"));
        }
    }
}