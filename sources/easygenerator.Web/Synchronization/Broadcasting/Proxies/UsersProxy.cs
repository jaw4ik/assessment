using Microsoft.AspNet.SignalR;
using System.Collections.Generic;
using System.Linq;

namespace easygenerator.Web.Synchronization.Broadcasting.Proxies
{
    public class UsersProxy : MultipleClientsProxy
    {
        public UsersProxy(IHubContext hubContext, IEnumerable<string> users)
        {
            Proxies = users.Select(e => hubContext.Clients.User(e));
        }
    }
}