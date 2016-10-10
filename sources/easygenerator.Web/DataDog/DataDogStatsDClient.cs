using StatsdClient;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.DataDog
{
    public class DataDogStatsDClient: IDataDogStatsDClient
    {
        private const int SampleRate = 1;
        private readonly string[] _tags;

        public DataDogStatsDClient(ConfigurationReader configurationReader)
        {
            DogStatsd.Configure(new StatsdConfig
            {
                StatsdServerName = configurationReader.DataDogStatsDClientConfiguration.Hostname,
                StatsdPort = configurationReader.DataDogStatsDClientConfiguration.Port,
                Prefix = configurationReader.DataDogStatsDClientConfiguration.Prefix,
                StatsdMaxUDPPacketSize = configurationReader.DataDogStatsDClientConfiguration.MaxUDPPacketSize
            });

            var tags = configurationReader.DataDogStatsDClientConfiguration.Tags;
            _tags = new string[tags.Count];
            for (int i = 0; i < tags.Count; i++)
            {
                _tags[i] = tags[i].Name;
            }
        }
        public void Event(string title, string text, string alertType = null, string aggregationKey = null, string sourceType = null,
            int? dateHappened = null, string priority = null, string hostname = null, string[] tags = null)
        {
            DogStatsd.Event(title, text, alertType, aggregationKey, sourceType, dateHappened, priority, hostname, tags ?? _tags);
        }
        public void Increment(string statName, int value = 1, double sampleRate = SampleRate, string[] tags = null)
        {
            DogStatsd.Increment(statName, value, sampleRate, tags ?? _tags);
        }
        public void Gauge<T>(string statName, T value, double sampleRate = SampleRate, string[] tags = null)
        {
            DogStatsd.Gauge(statName, value, sampleRate, tags ?? _tags);
        }
        public void Histogram<T>(string statName, T value, double sampleRate = SampleRate, string[] tags = null)
        {
            DogStatsd.Histogram(statName, value, sampleRate, tags ?? _tags);
        }
        public void Set<T>(string statName, T value, double sampleRate = SampleRate, string[] tags = null)
        {
            DogStatsd.Set(statName, value, sampleRate, tags ?? _tags);
        }
    }
}
