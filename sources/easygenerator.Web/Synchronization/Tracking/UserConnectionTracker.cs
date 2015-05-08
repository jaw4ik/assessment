using System;
using System.Collections.Generic;
using System.Linq;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Synchronization.Tracking
{
    public class UserConnectionTracker : IUserConnectionTracker
    {
        public static readonly UserConnectionTracker Instance = new UserConnectionTracker();

        private readonly IDictionary<string, string> _connections;

        public UserConnectionTracker()
        {
            _connections = new Dictionary<string, string>();
        }

        public void AddConnection(string connectionId, string user)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(connectionId, "connectionId");
            ArgumentValidation.ThrowIfNullOrEmpty(user, "user");
            _connections[connectionId] = user;
        }

        public void RemoveConnection(string connectionId)
        {
            _connections.Remove(connectionId);
        }

        public int GetConnectionsCount()
        {
            return _connections.Count;
        }

        public IEnumerable<string> GetOnlineUsersCollection()
        {
            return _connections.Values.Distinct();
        }
    }
}