using System;
using System.IO;
using System.Net;
using System.Net.Mime;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using easygenerator.PdfConverter.Components.ActionResults;
using easygenerator.PdfConverter.Components.Attributes;

namespace easygenerator.PdfConverter.Controllers
{
    public class DefaultController : BaseApiController
    {
        private const string TEMP_FILES_LOCATION_DIRECTORY = "Pdf_Download";

        [HttpGet]
        public RedirectResult Index()
        {
            return Redirect("https://www.easygenerator.com");
        }

        [Route("convert"), HttpGet]
        [FileName("Document"), FileDownload]
        public IHttpActionResult Convert(string url, bool high_quality = false)
        {
            var directoryPath = Path.Combine(HttpRuntime.AppDomainAppPath, TEMP_FILES_LOCATION_DIRECTORY);
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            var filePath = Path.Combine(directoryPath, Guid.NewGuid() + ".pdf");

            try
            {
                Converter.PdfConverter.Convert(url, filePath, high_quality);
            }
            catch (Exception e)
            {
                HttpError(e.Message, HttpStatusCode.InternalServerError);
            }

            return new FileResult(filePath);
        }
    }
}