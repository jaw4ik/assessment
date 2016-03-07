using System.Net;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Models;
using System.Net.Http;
using easygenerator.PublicationServer.ActionFilters;
using easygenerator.PublicationServer.ViewModels;

namespace easygenerator.PublicationServer.Controllers
{
    [ExternalApiAuthorize]
    public class UserController : BaseApiController
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [Route("api/user/create")]
        [HttpPost]
        public HttpResponseMessage Create(UserInfoViewModel userInfo)
        {
            if (_userRepository.Get(userInfo.Email) == null)
            {
                _userRepository.Add(new User(userInfo.Email, userInfo.AccessType));
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("api/user/update")]
        [HttpPost]
        public HttpResponseMessage Update(UserInfoViewModel userInfo)
        {
            _userRepository.Update(new User(userInfo.Email, userInfo.AccessType));
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
