using easygenerator.Infrastructure;
using easygenerator.Web.DataDog;
using easygenerator.Web.Synchronization.Tracking;

namespace easygenerator.Web.Components.Tasks
{
    public class DataDogReporterTask : ITask
    {
        private readonly IDataDogStatsDClient _dataDogStatsDClient;

        public DataDogReporterTask(IDataDogStatsDClient dataDogStatsDClient)
        {
            _dataDogStatsDClient = dataDogStatsDClient;
        }

        public void Execute()
        {
            _dataDogStatsDClient.Gauge("connections_online_count", UserConnectionTracker.Instance.GetConnectionsCount());
            _dataDogStatsDClient.Gauge("users_online_count", UserConnectionTracker.Instance.GetOnlineUsersCount());
        }
    }
}