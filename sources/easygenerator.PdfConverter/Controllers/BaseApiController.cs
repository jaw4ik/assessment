using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace easygenerator.PdfConverter.Controllers
{
    public class BaseApiController : ApiController
    {
        protected void HttpError(string errorMessage, HttpStatusCode statusCode)
        {
            throw new HttpResponseException(new HttpResponseMessage(statusCode)
            {
                Content = new StringContent(errorMessage)
            });
        }
    }
}