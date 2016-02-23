using System.Collections.ObjectModel;
using easygenerator.Infrastructure.Serialization.Providers;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace easygenerator.Infrastructure.Tests.Serialization
{
    [TestClass]
    public class SerializationProviderTests
    {
        private Collection<string> SerializableData;
        private ISerializationProvider<Collection<string>> SerializationProvider;

        [TestInitialize]
        public void InitializeContext()
        {
            SerializableData = new Collection<string>() {"data1", "data2"};
            SerializationProvider = new SerializationProvider<Collection<string>>();
        }

        [TestMethod]
        public void Serialize_ShouldReturnSerializedData()
        {
            var data = SerializationProvider.Serialize(SerializableData);
            data.Length.Should().NotBe(0);
        }

        [TestMethod]
        public void Deserialize_ShouldReturnOriginalObjectFromSerializedData()
        {
            var data = SerializationProvider.Serialize(SerializableData);
            var original = SerializationProvider.Deserialize(data);

            original.Count.Should().Be(2);
            original[0].Should().Be("data1");
            original[1].Should().Be("data2");
        }

    }
}
