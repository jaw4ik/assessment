using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using easygenerator.StorageServer.Components.Dispatchers;
using easygenerator.StorageServer.Repositories;

namespace easygenerator.StorageServer.Controllers
{
    public class UserController : DefaultStorageApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IPermissionsDispatcher _permissionsDispatcher;

        public UserController(IUserRepository userRepository, IPermissionsDispatcher permissionsDispatcher)
        {
            _userRepository = userRepository;
            _permissionsDispatcher = permissionsDispatcher;
        }

        public async Task<dynamic> Get()
        {
            var issuerName = ClaimsPrincipal.Current.Claims.First(_ => _.Type == ClaimTypes.Name).Issuer;
            var user = _userRepository.GetOrAddUserByEmail(User.Identity.Name);
            var accessType = await _permissionsDispatcher.GetUserAccessType(Request.Headers.Authorization.Parameter, issuerName);

            return new
            {
                AvailableStorageSpace = _permissionsDispatcher.GetUserAvailableStorageSpace(user, accessType),
                TotalStorageSpace = _permissionsDispatcher.GetStorageSpaceForAccessType(accessType)
            };
        }
    }
}