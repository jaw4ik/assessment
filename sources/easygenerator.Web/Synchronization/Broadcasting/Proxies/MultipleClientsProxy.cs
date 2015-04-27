using Microsoft.AspNet.SignalR.Hubs;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;

namespace easygenerator.Web.Synchronization.Broadcasting.Proxies
{
    public class MultipleClientsProxy : DynamicObject, IClientProxy
    {
        protected IEnumerable<dynamic> Proxies { get; set; }

        public MultipleClientsProxy(IEnumerable<dynamic> proxies)
        {
            Proxies = proxies;
        }

        protected MultipleClientsProxy()
        {

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
            Proxies.ToList().ForEach(proxy => tasks.Add(proxy.Invoke(method, args)));

            return Task.WhenAll(tasks);
        }
    }
}