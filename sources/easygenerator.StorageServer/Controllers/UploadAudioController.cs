using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using easygenerator.StorageServer.Components;
using easygenerator.StorageServer.Components.Convertion;
using easygenerator.StorageServer.Components.Dispatchers;
using easygenerator.StorageServer.Components.Vimeo;
using easygenerator.StorageServer.Models.Entities;
using easygenerator.StorageServer.Repositories;

namespace easygenerator.StorageServer.Controllers
{
    public class UploadAudioController : DefaultStorageApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IRepository<Audio> _audioRepository;
        private readonly IPermissionsDispatcher _permissionsDispatcher;
        private readonly IVimeoPullUpload _vimeoPullUpload;
        private readonly IConvertionService _convertionService;


        public UploadAudioController(IUserRepository userRepository, IRepository<Audio> audioRepository, IPermissionsDispatcher permissionsDispatcher, IVimeoPullUpload vimeoPullUpload, IConvertionService convertionService)
        {
            _userRepository = userRepository;
            _audioRepository = audioRepository;
            _permissionsDispatcher = permissionsDispatcher;
            _vimeoPullUpload = vimeoPullUpload;
            _convertionService = convertionService;
        }


        [Route("api/media/audio/ticket")]
        public async Task<string> Ticket()
        {
            var ticket = await _convertionService.GetTicketAsync();

            if (String.IsNullOrWhiteSpace(ticket))
            {
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }

            return ticket;
        }

        [Route("api/media/audio/pull"), HttpPost]
        public async Task<dynamic> Pull(AudioUploadModel model)
        {
            var issuerName = ClaimsPrincipal.Current.Claims.First(_ => _.Type == ClaimTypes.Name).Issuer;
            var user = _userRepository.GetOrAddUserByEmail(User.Identity.Name);
            var accessType = await _permissionsDispatcher.GetUserAccessType(Request.Headers.Authorization.Parameter, issuerName);
            if (!_permissionsDispatcher.UserCanUploadFile(user, accessType, model.Size))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            var audio = new Audio(model.Title, model.Duration, model.Size, UrlResolver.RemoveSchemeFromUrl(model.Url), user.Id);

            var vimeoId = await _vimeoPullUpload.PullAsync(model.Url);
            if (String.IsNullOrWhiteSpace(vimeoId))
            {
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }

            audio.SetVimeoId(vimeoId);
            _audioRepository.Add(audio);
            user.ConsumeStorageSpace(model.Size);

            return new { audio.Id, audio.VimeoId, audio.CreatedOn };
        }

        [Route("api/media/audio/update"), HttpPost]
        public void MarkAsAvailable(AudioUpdateModel model)
        {
            var audio = _audioRepository.Get(model.Id);
            if (audio == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            audio.MarkAsAvailable();
        }
    }

    public class AudioUploadModel
    {
        public string Title { get; set; }
        public int Duration { get; set; }
        public long Size { get; set; }
        public string Url { get; set; }
    }

    public class AudioUpdateModel
    {
        public Guid Id { get; set; }
    }
}