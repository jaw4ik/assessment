using easygenerator.Web.BuildCourse.PackageModel;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace easygenerator.Web.BuildCourse
{
    public class PackageModelSerializer
    {
        public virtual string Serialize(CoursePackageModel coursePackageModel)
        {
            return JsonConvert.SerializeObject(
                coursePackageModel,
                Formatting.None,
                new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
            );
        }
    }
}