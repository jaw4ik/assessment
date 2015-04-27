using easygenerator.Web.Synchronization.Broadcasting.Proxies;
using easygenerator.Web.Synchronization.Hubs;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.Synchronization.Broadcasting
{
    public class Broadcaster : IBroadcaster
    {
        protected readonly IHubContext HubContext;

        protected string CurrentUsername
        {
            get { return HttpContext.Current.User.Identity.Name; }
        }

        public Broadcaster(IHubContext hubContext)
        {
            HubContext = hubContext;
        }

        public Broadcaster()
            : this(GlobalHost.ConnectionManager.GetHubContext<EventHub>())
        {

        }

        public dynamic User(string username)
        {
            return HubContext.Clients.User(username);
        }

        public dynamic Users(IEnumerable<string> users)
        {
            return new UsersProxy(HubContext, users);
        }

        public dynamic UsersExcept(IEnumerable<string> users, IEnumerable<string> excludeUsers)
        {
            return Users(users.Except(excludeUsers, StringComparer.OrdinalIgnoreCase));
        }

        public dynamic UsersExcept(IEnumerable<string> users, params string[] excludeUsers)
        {
            return UsersExcept(users, (IEnumerable<string>)excludeUsers);
        }
    }
}