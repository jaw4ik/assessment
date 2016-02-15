using System.Net;
using System.Net.Http;
using System.Runtime.Serialization.Formatters;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using easygenerator.StorageServer.Components.Vimeo;
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

        private readonly IVimeoGetSources _vimeoGetSources;
       
        public RootController(IVimeoGetSources vimeoGetSources)
        {
            _vimeoGetSources = vimeoGetSources;
        }

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

        [Route("api/mediasources/{id}"), HttpGet]
        public async Task<JsonResult<object>> MediaSources(string id)
        {
            var result = await _vimeoGetSources.GetSourcesAsync(id);
            if (result is HttpResponseMessage)
            {
                throw new HttpResponseException(((HttpResponseMessage)result).StatusCode);
            }

            return new JsonResult<object>(result, _settings, Encoding.UTF8, Request);
        }

    }
}