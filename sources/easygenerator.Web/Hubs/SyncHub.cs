using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace easygenerator.Web.Hubs
{
    [HubName("sync")]
    public class SyncHub : Hub
    {
    }
}