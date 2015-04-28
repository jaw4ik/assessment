using System.Threading.Tasks;
using easygenerator.Web.Synchronization.Tracking;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace easygenerator.Web.Synchronization.Hubs
{
    [HubName("eventHub")]
    public class EventHub : Hub
    {
        public override Task OnConnected()
        {
            UserConnectionTracker.Instance.AddConnection(Context.ConnectionId, Context.User.Identity.Name);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            UserConnectionTracker.Instance.RemoveConnection(Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }
    }
}