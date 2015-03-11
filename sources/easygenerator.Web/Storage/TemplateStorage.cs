using System.IO;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Storage
{
    public interface ITemplateStorage
    {
        bool FileExists(Template template, string filePath);
        string GetAbsoluteFilePath(Template template, string filePath);
        string GetTemplateDirectoryPath(Template template);
    }

    public class TemplateStorage : ITemplateStorage
    {
        private readonly ConfigurationReader _configurationReader;
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;
        private readonly PhysicalFileManager _physicalFileManager;

        public TemplateStorage(ConfigurationReader configurationReader, HttpRuntimeWrapper httpRuntimeWrapper, PhysicalFileManager physicalFileManager)
        {
            _configurationReader = configurationReader;
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _physicalFileManager = physicalFileManager;
        }

        public bool FileExists(Template template, string filePath)
        {
            return _physicalFileManager.FileExists(GetAbsoluteFilePath(template, filePath));
        }

        public string GetAbsoluteFilePath(Template template, string filePath)
        {
            return Path.Combine(GetTemplateDirectoryPath(template), filePath);
        }

        public string GetTemplateDirectoryPath(Template template)
        {
            return template.IsCustom
                ? Path.Combine(TemplatesDirectoryPath, _configurationReader.TempateStorageConfiguration.CustomTemplatesDirectory, template.Name)
                : Path.Combine(TemplatesDirectoryPath, template.Name);
        }

        private string TemplatesDirectoryPath {
            get
            {
                return Path.IsPathRooted(_configurationReader.TempateStorageConfiguration.Path)
                    ? _configurationReader.TempateStorageConfiguration.Path
                    : Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), _configurationReader.TempateStorageConfiguration.Path);
            }
        }
    }
}