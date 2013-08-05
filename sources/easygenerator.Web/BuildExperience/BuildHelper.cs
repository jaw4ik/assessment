using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using easygenerator.Infrastructure;
using easygenerator.Web.BuildExperience.BuildModel;

namespace easygenerator.Web.BuildExperience
{
    public class BuildHelper : IBuildHelper
    {
        private readonly IPhysicalFileManager _fileManager;
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;

        public string BuildPath { get; private set; }
        public string WebsitePath { get; private set; }
        public string TemplatesPath { get; private set; }
        public string DownloadPath { get; private set; }

        public BuildHelper(IPhysicalFileManager fileManager, HttpRuntimeWrapper httpRuntimeWrapper)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;

            BuildPath = Path.Combine(Path.GetTempPath(), "eg", "build");
            WebsitePath = _httpRuntimeWrapper.GetDomainAppPath();
            TemplatesPath = Path.Combine(WebsitePath, "Templates");
            DownloadPath = Path.Combine(WebsitePath, "Download");

            _fileManager = fileManager;
        }

        private string GetBuildDirectoryName(string buildId)
        {
            return Path.Combine(BuildPath, buildId);
        }

        private string GetTemplateDirectoryName(string templateName)
        {
            return Path.Combine(TemplatesPath, templateName);
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