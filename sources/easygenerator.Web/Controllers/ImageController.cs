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

        public ImageController(IEntityFactory entityFactory, IStorage storage, IImageStorage imageStorage, IImageFileRepository repository, IUrlHelperWrapper urlHelperWrapper, IFileTypeChecker fileTypeChecker, ILog elmahLog)
        {
            _entityFactory = entityFactory;
            _storage = storage;
            _imageStorage = imageStorage;
            _repository = repository;
            _urlHelperWrapper = urlHelperWrapper;
            _fileTypeChecker = fileTypeChecker;
            _elmahLog = elmahLog;
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
                return HttpNotFound();
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
                    title = item.Title,
                    src = _urlHelperWrapper.RouteImageUrl(item.FileName)
                });

            return JsonSuccess(result);
        }

        [NoCache]
        [HttpPost]
        [Route("storage/image/upload")]
        public ActionResult Upload(HttpPostedFileBase file)
        {
            if (file == null || String.IsNullOrEmpty(file.FileName) || file.ContentLength == 0)
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

            return JsonSuccess(new { url = _urlHelperWrapper.RouteImageUrl(image.FileName) }, System.Net.Mime.MediaTypeNames.Text.Html);
        }

    }
}

