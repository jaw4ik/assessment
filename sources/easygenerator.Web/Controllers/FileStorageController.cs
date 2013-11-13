using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Controllers
{
    public class FileStorageController : Controller
    {
        public static readonly string[] AllowedExtensions = new[] { ".gif", ".jpeg", ".jpg", ".png" };

        private HttpRuntimeWrapper _httpRuntimeWrapper;
        private PhysicalFileManager _physicalFileManager;
        private readonly ConfigurationReader _configurationReader;

        private string FileStoragePath
        {
            get
            {
                return Path.IsPathRooted(_configurationReader.FileStorageConfiguration.Path)
                    ? _configurationReader.FileStorageConfiguration.Path
                    : Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), _configurationReader.FileStorageConfiguration.Path);
            }
        }

        public FileStorageController(HttpRuntimeWrapper httpRuntimeWrapper, PhysicalFileManager physicalFileManager, ConfigurationReader configurationReader)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _physicalFileManager = physicalFileManager;
            _configurationReader = configurationReader;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Get(string fileId)
        {
            var fileLocation = Path.Combine(FileStoragePath, fileId[0].ToString(), fileId);

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

            if (file.ContentLength > _configurationReader.FileStorageConfiguration.MaximumFileSize)
            {
                return new TextJsonErrorResult("File size too big");
            }

            var fileInfo = new FileInfo(file.FileName);
            if (!AllowedExtensions.Contains(fileInfo.Extension.ToLower()))
            {
                return new TextJsonErrorResult("Forbidden file extension *" + fileInfo.Extension);
            }

            var newFileName = Guid.NewGuid().ToString("N");
            var fileStoragePath = Path.Combine(FileStoragePath, newFileName[0].ToString());
            _physicalFileManager.CreateDirectoryIfNotExists(fileStoragePath);
            var savePath = Path.Combine(fileStoragePath, newFileName + fileInfo.Extension);
            file.SaveAs(savePath);

            var rootDomain = Request.Url.AbsoluteUri.Replace(Request.Url.AbsolutePath, string.Empty);
            return new TextJsonSuccessResult(new { url = Path.Combine(rootDomain + "/", _configurationReader.FileStorageConfiguration.Url, newFileName + fileInfo.Extension) });
        }

    }
}
