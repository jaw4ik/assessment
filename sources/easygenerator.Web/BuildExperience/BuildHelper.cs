using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience.BuildModel;

namespace easygenerator.Web.BuildExperience
{
    public class BuildHelper : IBuildHelper
    {
        public static readonly string BuildPath = "C:\\Temp\\eg\\build";
        public static readonly string WebsitePath = "D:\\Applications\\easygenerator-web";
        public static readonly string TemplatePath = WebsitePath + "\\Templates";
        public static readonly string DownloadPath = WebsitePath + "\\Download";

        private IPhysicalFileManager _fileManager;

        private string GetBuildDirectoryName(string buildId)
        {
            return Path.Combine(BuildPath, buildId);
        }

        private string GetTemplateDirectoryName(string templateName)
        {
            return Path.Combine(TemplatePath, templateName);
        }

        private string GetObjectiveDirectoryName(string buildId, string objectiveId)
        {
            return Path.Combine(GetContentDirectoryName(buildId), objectiveId);
        }

        private string GetQuestionDirectoryName(string buildId, string objectiveId, string questionId)
        {
            return Path.Combine(GetObjectiveDirectoryName(buildId, objectiveId), questionId);
        }

        private string GetExplanationFileName(string buildId, string objectiveId, string questionId, string explanationId)
        {
            return Path.Combine(GetQuestionDirectoryName(buildId, objectiveId, questionId), explanationId + ".html");
        }

        private string GetDataFileName(string buildId)
        {
            return Path.Combine(GetContentDirectoryName(buildId), "data.js");
        }

        private string GetBuildPackageFileName(string buildId)
        {
            return Path.Combine(DownloadPath, buildId + ".zip");
        }

        private string GetContentDirectoryName(string buildId)
        {
            return Path.Combine(BuildPath, buildId, "content");
        }

        public BuildHelper(IPhysicalFileManager fileManager)
        {
            _fileManager = fileManager;
        }

        public void CreateBuildDirectory(string buildId)
        {
            _fileManager.CreateDirectory(GetBuildDirectoryName(buildId));
        }

        public void DeleteBuildDirectory(string buildId)
        {
            _fileManager.DeleteDirectory(GetBuildDirectoryName(buildId));
        }

        public void CopyTemplateToBuildDirectory(string buildId, string templateName)
        {
            _fileManager.CopyDirectory(GetTemplateDirectoryName(templateName), GetBuildDirectoryName(buildId));
            _fileManager.DeleteDirectory(GetContentDirectoryName(buildId));
        }

        public void CreateObjectiveDirectory(string buildId, string objectiveId)
        {
            _fileManager.CreateDirectory(GetObjectiveDirectoryName(buildId, objectiveId));
        }

        public void CreateQuestionDirectory(string buildId, string objectiveId, string questionId)
        {
            _fileManager.CreateDirectory(GetQuestionDirectoryName(buildId, objectiveId, questionId));
        }

        public void WriteExplanation(string buildId, string objectiveId, string questionId, string explanationId,
                                     string explanationText)
        {
            _fileManager.WriteToFile(GetExplanationFileName(buildId, objectiveId, questionId, explanationId), explanationText);
        }

        public void WriteDataToFile(string buildId, string data)
        {
            _fileManager.WriteToFile(GetDataFileName(buildId), data);
        }

        public string SerializeBuildModel(ExperienceBuildModel buildModel)
        {
            return JsonConvert.SerializeObject(
                    buildModel,
                    Formatting.None,
                    new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
                );
        }

        public void CreateBuildPackage(string buildId)
        {
            var packagePath = GetBuildPackageFileName(buildId);
            _fileManager.DeleteFile(packagePath);
            _fileManager.ArchiveDirectory(GetBuildDirectoryName(buildId), packagePath);
        }
    }
}