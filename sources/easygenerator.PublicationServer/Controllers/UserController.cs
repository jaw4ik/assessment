using System.Net;
using System.Web.Http;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Models;
using System.Net.Http;
using easygenerator.PublicationServer.ActionFilters;

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
        public HttpResponseMessage Create(string email, AccessType accessType)
        {
            if (_userRepository.Get(email) == null)
            {
                _userRepository.Add(new User(email, accessType));
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("api/user/update")]
        [HttpPost]
        public HttpResponseMessage Update(string email, AccessType accessType)
        {
            _userRepository.Update(new User(email, accessType));
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
