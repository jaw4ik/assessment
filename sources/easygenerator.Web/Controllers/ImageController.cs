using easygenerator.Auth.Attributes.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Components.Elmah;
using easygenerator.Web.Storage;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Controllers
{
    public class ImageController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IStorage _storage;
        private readonly IImageStorage _imageStorage;
        private readonly IImageFileRepository _repository;
        private readonly IUrlHelperWrapper _urlHelperWrapper;
        private readonly IFileTypeChecker _fileTypeChecker;
        private readonly ILog _elmahLog;
        private readonly PhysicalFileManager _fileManager;

        public ImageController(IEntityFactory entityFactory,
            IStorage storage,
            IImageStorage imageStorage,
            IImageFileRepository repository,
            IUrlHelperWrapper urlHelperWrapper,
            IFileTypeChecker fileTypeChecker,
            ILog elmahLog,
            PhysicalFileManager fileManager)
        {
            _entityFactory = entityFactory;
            _storage = storage;
            _imageStorage = imageStorage;
            _repository = repository;
            _urlHelperWrapper = urlHelperWrapper;
            _fileTypeChecker = fileTypeChecker;
            _elmahLog = elmahLog;
            _fileManager = fileManager;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("filestorage/{fileName}")]
        [Route("storage/image/{fileName}", Name = "ImageUrl")]
        public ActionResult Get(string fileName, int? width, int? height, bool? scaleBySmallerSide = false)
        {
            if (fileName == null)
            {
                return BadRequest();
            }

            if (!_storage.FileExists(fileName))
            {
                var path = Path.Combine(Server.MapPath("/Content/images"), "image-not-found.png");
                return new ImageResult(path);
            }

            string filePath;

            if (width.HasValue && height.HasValue)
            {
                try
                {
                    filePath = _imageStorage.GetImagePath(fileName, width.Value, height.Value,
                        scaleBySmallerSide.HasValue && scaleBySmallerSide.Value);
                }
                catch (InvalidOperationException e)
                {
                    _elmahLog.LogException(e);
                    return BadRequest();
                }
                catch (ArgumentException e)
                {
                    _elmahLog.LogException(e);
                    return HttpNotFound();
                }
            }
            else
            {
                filePath = _storage.GetFilePath(fileName);
            }

            return new ImageResult(filePath);
        }

        [NoCache]
        [Route("api/images")]
        public ActionResult GetCurrentUserImageCollection()
        {
            var userName = GetCurrentUsername();
            var images = _repository.GetCollection(e => e.CreatedBy == userName);

            var result = images
                .OrderByDescending(e => e.CreatedOn)
                .Select(item => new
                {
                    id = item.Id.ToNString(),
                    title = item.Title,
                    url = _urlHelperWrapper.RouteImageUrl(item.FileName)
                });

            return JsonSuccess(result);
        }

        [NoCache]
        [HttpPost]
        [Scope("api", "settings")]
        [Route("storage/image/upload")]
        public ActionResult Upload(HttpPostedFileBase file)
        {
            return UploadImage(file);
        }

        [NoCache]
        [HttpPost]
        [Scope("api")]
        [Route("storage/image/serverupload")]
        public ActionResult Upload()
        {
            return UploadImage(Request.Files[0]);
        }

        private ActionResult UploadImage(HttpPostedFileBase file)
        {
            if (string.IsNullOrEmpty(file?.FileName) || file.ContentLength == 0)
            {
                return BadRequest();
            }

            if (!_fileTypeChecker.IsImage(file.InputStream))
            {
                return BadRequest();
            }

            if (file.ContentLength > _storage.GetMaxFileSize())
            {
                return new HttpStatusCodeResult(HttpStatusCode.RequestEntityTooLarge);
            }

            var image = _entityFactory.ImageFile(new FileInfo(file.FileName).Name, GetCurrentUsername());
            _repository.Add(image);

            file.SaveAs(_storage.MapFilePath(image.FileName));

            return JsonSuccess(new
            {
                id = image.Id.ToNString(),
                title = image.Title,
                url = _urlHelperWrapper.RouteImageUrl(image.FileName)
            }, System.Net.Mime.MediaTypeNames.Text.Html);
        }

        [NoCache]
        [HttpPost]
        [Scope("api", "settings")]
        [Route("storage/image/delete")]
        public ActionResult Delete(ImageFile imageFile)
        {
            if (imageFile != null)
            {
                _repository.Remove(imageFile);

                var filePath = _storage.GetFilePath(imageFile.FileName);
                var cachedImagePath = _imageStorage.GetCachedImagePath(imageFile.FileName);

                try
                {
                    _fileManager.DeleteFile(filePath);
                    _fileManager.DeleteDirectory(cachedImagePath);
                }
                catch (Exception e)
                {
                    _elmahLog.LogException(e);
                }
            }

            return JsonSuccess();
        }
    }
}

