using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using easygenerator.StorageServer.Components.Dispatchers;
using easygenerator.StorageServer.Components.Vimeo;
using easygenerator.StorageServer.Models;
using easygenerator.StorageServer.Models.Entities;
using easygenerator.StorageServer.Repositories;

namespace easygenerator.StorageServer.Controllers
{
    public class UploadVideoController : DefaultStorageApiController
    {
        private readonly IVimeoPutUpload _vimeoPutUpload;
        private readonly IVimeoUploadDispatcher _vimeoUploadDispatcher;
        private readonly IUserRepository _userRepository;
        private readonly IRepository<Video> _videoRepository;
        private readonly IPermissionsDispatcher _permissionsDispatcher;

        public UploadVideoController(
            IVimeoPutUpload vimeoPutUpload, IVimeoUploadDispatcher vimeoUploadDispatcher,
            IUserRepository userRepository, IRepository<Video> videoRepository,
            IPermissionsDispatcher permissionsDispatcher)
        {
            _vimeoPutUpload = vimeoPutUpload;
            _vimeoUploadDispatcher = vimeoUploadDispatcher;
            _userRepository = userRepository;
            _videoRepository = videoRepository;
            _permissionsDispatcher = permissionsDispatcher;
        }

        [Route("api/media/video/upload")]
        public async Task<dynamic> GetUploadTicket(string title, long size)
        {
            var issuerName = ClaimsPrincipal.Current.Claims.First(_ => _.Type == ClaimTypes.Name).Issuer;
            var user = _userRepository.GetOrAddUserByEmail(User.Identity.Name);
            var accessType = await _permissionsDispatcher.GetUserAccessType(Request.Headers.Authorization.Parameter, issuerName);

            if (!_permissionsDispatcher.UserCanUploadFile(user, accessType, size))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            var ticket = await _vimeoPutUpload.GetUplodTicketAsync();
            if (ticket == null)
            {
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }

            var video = new Video(title, size, user.Id);
            _vimeoUploadDispatcher.StartUploading(ticket, video);

            return new { VideoId = video.Id, UploadUrl = ticket.UploadUrl };
        }

        [Route("api/media/video/upload/cancel"), HttpPost]
        public void Cancel(VimeoUploadRequestModel vm)
        {
            var user = _userRepository.GetOrAddUserByEmail(User.Identity.Name);
            if (_vimeoUploadDispatcher.GetUploading(vm.VideoId).Video.UserId != user.Id)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            _vimeoUploadDispatcher.EndUploading(vm.VideoId);
        }

        [Route("api/media/video/upload/progress"), HttpPost]
        public void Progress(VimeoUploadRequestModel vm)
        {
            if (!_vimeoUploadDispatcher.UpdateUploadingLifetime(vm.VideoId))
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }

        [Route("api/media/video/upload/finish"), HttpPost]
        public async Task<string> Finish(VimeoUploadRequestModel vm)
        {
            var videoUpload = _vimeoUploadDispatcher.GetUploading(vm.VideoId);
            if (videoUpload == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            if (!await _vimeoPutUpload.VerifyAsync(videoUpload.Ticket.UploadUrl, videoUpload.Video.Size))
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            var vimeoId = await _vimeoPutUpload.CompleteAsync(videoUpload.Ticket.CompleteUrl);
            if (String.IsNullOrEmpty(vimeoId))
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            var video = videoUpload.Video;
            var user = _userRepository.GetOrAddUserByEmail(User.Identity.Name);
            video.SetVimeoId(vimeoId);
            _videoRepository.Add(video);
            user.ConsumeStorageSpace(video.Size);
            _vimeoUploadDispatcher.EndUploading(vm.VideoId);
            return vimeoId;
        }
    }
}