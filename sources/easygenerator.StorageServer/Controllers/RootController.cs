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
            if (string.IsNullOrEmpty(id))
            {
                throw new HttpException(404, "Video with such id was not found");
            }
            return Redirect(string.Format("{0}://player.vimeo.com/video/{1}{2}", Request.RequestUri.Scheme, id, Request.RequestUri.Query));
        }

        [Route("api/mediasources/{id}"), HttpGet]
        public async Task<JsonResult<object>> MediaSources(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new HttpException(404, "Video with such id was not found");
            }
            var source = await _vimeoGetSources.GetSourcesAsync(id);
            return new JsonResult<object>(source, _settings, Encoding.UTF8, Request);
        }

    }
}