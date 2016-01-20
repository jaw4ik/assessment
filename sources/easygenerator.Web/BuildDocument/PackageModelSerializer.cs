using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace easygenerator.Web.BuildDocument
{
    public class PackageModelSerializer
    {
        public virtual string Serialize(object packageModel)
        {
            return JsonConvert.SerializeObject(
                packageModel,
                Formatting.None,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
            );
        }
    }
}