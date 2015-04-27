using System.Collections.Generic;

namespace easygenerator.Web.Synchronization.Tracking
{
    public interface IUserConnectionTracker
    {
        void AddConnection(string connectionId, string user);

        void RemoveConnection(string connectionId);

        int GetConnectionsCount();

        IEnumerable<string> GetOnlineUsersCollection();
    }
}