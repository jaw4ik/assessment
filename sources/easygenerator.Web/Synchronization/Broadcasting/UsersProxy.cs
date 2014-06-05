using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Collections.Generic;
using System.Dynamic;
using System.Threading.Tasks;

namespace easygenerator.Web.Synchronization.Broadcasting
{
    public class UsersProxy : DynamicObject, IClientProxy
    {
        private readonly List<string> _users;
        private readonly IHubContext _hubContext;

        public UsersProxy(IHubContext hubContext, List<string> users)
        {
            _hubContext = hubContext;
            _users = users;
        }

        public override bool TryGetMember(GetMemberBinder binder, out object result)
        {
            result = null;
            return false;
        }

        public override bool TryInvokeMember(InvokeMemberBinder binder, object[] args, out object result)
        {
            result = Invoke(binder.Name, args);
            return true;
        }

        public Task Invoke(string method, params object[] args)
        {
            var tasks = new List<Task>();
            _users.ForEach(e => tasks.Add(_hubContext.Clients.User(e).Invoke(method, args)));

            return Task.WhenAll(tasks);
        }
    }
}