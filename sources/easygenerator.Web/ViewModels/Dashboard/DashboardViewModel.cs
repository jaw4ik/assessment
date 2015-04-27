using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace easygenerator.Web.ViewModels.Dashboard
{
    public class DashboardViewModel
    {
        public int OnlineConnectionsCount { get; private set; }
        public IEnumerable<string> UniqueOnlineUsers { get; private set; }

        public DashboardViewModel(int onlineConnectionsCount, IEnumerable<string> uniqueOnlineUsers)
        {
            OnlineConnectionsCount = onlineConnectionsCount;
            UniqueOnlineUsers = uniqueOnlineUsers;
        }
    }
}