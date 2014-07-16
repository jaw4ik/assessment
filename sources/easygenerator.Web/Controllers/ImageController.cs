using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.ActionFilters;
using easygenerator.Web.Components.ActionResults;
using easygenerator.Web.Storage;

namespace easygenerator.Web.Controllers
{
    [NoCache]
    public class ImageController : DefaultController
    {
        private readonly IEntityFactory _entityFactory;
        private readonly IStorage _storage;
        private readonly IImageFileRepository _repository;
        private readonly IUrlHelperWrapper _urlHelperWrapper;
        private readonly IImageValidator _imageValidator;

        public ImageController(IEntityFactory entityFactory, IStorage storage, IImageFileRepository repository, IUrlHelperWrapper urlHelperWrapper, IImageValidator imageValidator)
        {
            _entityFactory = entityFactory;
            _storage = storage;
            _repository = repository;
            _urlHelperWrapper = urlHelperWrapper;
            _imageValidator = imageValidator;
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("storage/image/{fileName}", Name = "ImageUrl")]
        [Route("filestorage/{fileName}")]
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

            return new ImageResult(_storage.GetFilePath(fileName), width, height, scaleBySmallerSide);
        }


        [HttpGet]
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

        [HttpPost]
        [Route("storage/image/upload")]
        public ActionResult Upload(HttpPostedFileBase file)
        {
            if (file == null || String.IsNullOrEmpty(file.FileName) || file.ContentLength == 0)
            {
                return BadRequest();
            }

            if (!_imageValidator.IsImage(file.InputStream))
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

