using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using easygenerator.StorageServer.Components.Vimeo;
using easygenerator.StorageServer.Models;
using easygenerator.StorageServer.Models.Entities;
using easygenerator.StorageServer.Repositories;

namespace easygenerator.StorageServer.Controllers
{
    public class MediaController : DefaultStorageApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IVimeoDelete _vimeoDelete;
        private readonly IRepository<Video> _videoRepository;
        private readonly IRepository<Audio> _audioRepository;

        public MediaController(IUserRepository userRepository, IRepository<Video> videoRepository, IRepository<Audio> audioRepository, IVimeoDelete vimeoDelete)
        {
            _userRepository = userRepository;
            _videoRepository = videoRepository;
            _audioRepository = audioRepository;
            _vimeoDelete = vimeoDelete;
        }


        public object Get()
        {
            var user = _userRepository.GetOrAddUserByEmail(User.Identity.Name);

            return new
            {
                Videos = _videoRepository.GetCollection(v => v.UserId == user.Id).OrderByDescending(v => v.CreatedOn).Select(e => new { e.Id, e.Title, e.VimeoId, e.CreatedOn }),
                Audios = _audioRepository.GetCollection(e => e.UserId == user.Id).OrderByDescending(v => v.CreatedOn).Select(e => new { e.Id, e.Title, e.VimeoId, e.Duration, e.Status, e.Source, e.CreatedOn })
            };
        }


        [Route("api/media/video/delete"), HttpPost]
        public async Task<bool> DeleteVideo(DeleteMediaRequestModel model)
        {
            var video = _videoRepository.Get(model.MediaId);
            if (video == null)
            {
                return true;
            }
            
            _videoRepository.Remove(video);
            var user = _userRepository.GetOrAddUserByEmail(User.Identity.Name);
            user.ReleaseStorageSpace(video.Size);

            return await _vimeoDelete.DeleteAsync(video.VimeoId);
        }

        [Route("api/media/audio/delete"), HttpPost]
        public async Task<bool> DeleteAudio(DeleteMediaRequestModel model)
        {
            var audio = _audioRepository.Get(model.MediaId);
            if (audio == null)
            {
                return true;
            }

            _audioRepository.Remove(audio);
            var user = _userRepository.GetOrAddUserByEmail(User.Identity.Name);
            user.ReleaseStorageSpace(audio.Size);

            return await _vimeoDelete.DeleteAsync(audio.VimeoId);
        }
    }
}