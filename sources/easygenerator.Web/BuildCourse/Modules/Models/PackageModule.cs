using System.IO;
using System.Web.Hosting;

namespace easygenerator.Web.BuildCourse.Modules.Models
{
    public class PackageModule
    {
        public PackageModule(string name, string fileDirectoryPath)
        {
            Name = name;
            FilePath = Path.Combine(fileDirectoryPath, name + ".js");
        }

        public string Name { get; private set; }

        private string FilePath { get; set; }
        public virtual string GetFilePath()
        {
            return HostingEnvironment.MapPath(FilePath);
        }
    }
}