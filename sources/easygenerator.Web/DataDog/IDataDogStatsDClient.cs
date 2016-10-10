namespace easygenerator.Web.DataDog
{
    public interface IDataDogStatsDClient
    {
        void Event(string title, string text, string alertType = null, string aggregationKey = null, string sourceType = null,
            int? dateHappened = null, string priority = null, string hostname = null, string[] tags = null);
        void Increment(string statName, int value = 1, double sampleRate = 1, string[] tags = null);
        void Gauge<T>(string name, T value, double sampleRate = 1, string[] tags = null);
        void Histogram<T>(string statName, T value, double sampleRate = 1, string[] tags = null);
        void Set<T>(string statName, T value, double sampleRate = 1, string[] tags = null);
    }
}
