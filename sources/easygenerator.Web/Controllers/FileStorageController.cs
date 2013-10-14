using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Web;
using System.Web.Mvc;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Components.ActionResults;

namespace easygenerator.Web.Controllers
{
    [Authorize]
    public class FileStorageController : Controller
    {
        public static readonly long MaximumFileSize = 10 * 1024 * 1024; // 10 MB 
        public static readonly string FileStoragePath = "FileStorage";
        public static readonly string[] AllowedExtensions = new[] { ".gif", ".jpeg", ".jpg", ".png" };
        public static readonly string FilestorageApiUrl = "filestorage/";

        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _physicalFileManager;

        public FileStorageController(HttpRuntimeWrapper httpRuntimeWrapper, PhysicalFileManager physicalFileManager)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _physicalFileManager = physicalFileManager;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Get(string fileId)
        {
            var fileLocation = Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), FileStoragePath, fileId[0].ToString(), fileId);

            if (!_physicalFileManager.FileExists(fileLocation))
            {
                return new HttpStatusCodeResult(HttpStatusCode.NotFound);
            }

            return base.File(fileLocation, _physicalFileManager.GetFileContentType(fileLocation));
        }

        [HttpPost]
        public ActionResult Upload()
        {
            if (Request == null || Request.Files == null || Request.Files.Count == 0)
            {
                return new TextJsonErrorResult("Input data is invalid");
            }

            var file = Request.Files.Get(0);
            if (file == null || file.ContentLength == 0 || string.IsNullOrEmpty(file.FileName))
            {
                return new TextJsonErrorResult("File data is empty");
            }

            if (file.ContentLength > MaximumFileSize)
            {
                return new TextJsonErrorResult("File size too big");
            }

            var fileInfo = new FileInfo(file.FileName);
            if (!AllowedExtensions.Contains(fileInfo.Extension.ToLower()))
            {
                return new TextJsonErrorResult("Forbidden file extension *" + fileInfo.Extension);
            }

            var newFileName = Guid.NewGuid().ToString("N");
            var fileStoragePath = Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), FileStoragePath, newFileName[0].ToString());
            _physicalFileManager.CreateDirectoryIfNotExists(fileStoragePath);
            var savePath = Path.Combine(fileStoragePath, newFileName + fileInfo.Extension);
            file.SaveAs(savePath);

            var rootDomain = Request.Url.AbsoluteUri.Replace(Request.Url.AbsolutePath, string.Empty);
            return new TextJsonSuccessResult(new { url = Path.Combine(rootDomain + "/", FilestorageApiUrl, newFileName + fileInfo.Extension) });
        }

    }
}
