using easygenerator.Web.BuildExperience.PackageModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace easygenerator.Web.BuildExperience
{
    public class PackageModelSerializer
    {
        public virtual string Serialize(ExperiencePackageModel experiencePackageModel)
        {
            return JsonConvert.SerializeObject(
                experiencePackageModel,
                Formatting.None,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
            );
        }
    }
}