using System.Runtime.Serialization.Formatters;
using System.Web.Http;
using System.Web.Http.Results;
using Newtonsoft.Json;

namespace easygenerator.StorageServer.Controllers
{
    public class RootController : ApiController
    {
        private readonly JsonSerializerSettings _settings = new JsonSerializerSettings
        {
            Formatting = Formatting.Indented,
            TypeNameHandling = TypeNameHandling.None,
            DateFormatHandling = DateFormatHandling.IsoDateFormat,
            TypeNameAssemblyFormat = FormatterAssemblyStyle.Simple
        };

        [HttpGet]
        public RedirectResult Index()
        {
            return Redirect("https://www.easygenerator.com");
        }

        [HttpGet]
        public RedirectResult Video(string id)
        {
            return Redirect(string.Format("{0}://player.vimeo.com/video/{1}{2}", Request.RequestUri.Scheme, id, Request.RequestUri.Query));
        }
    }
}