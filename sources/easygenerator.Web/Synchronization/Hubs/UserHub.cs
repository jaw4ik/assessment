using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace easygenerator.Web.Synchronization.Hubs
{
    [HubName("user")]
    public class UserHub : Hub
    {
    }
}