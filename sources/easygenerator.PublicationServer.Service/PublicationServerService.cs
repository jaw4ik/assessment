using System.ServiceProcess;

namespace easygenerator.PublicationServer
{
    public partial class PublicationServerService : ServiceBase
    {
        public PublicationServerService()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            PublicationServer.Start();
        }

        protected override void OnStop()
        {
            PublicationServer.Stop();
        }
    }
}
