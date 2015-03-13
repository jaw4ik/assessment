using System;
using System.IO;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Storage
{
    public interface ITemplateStorage
    {
        bool TemplateDirectoryExist(Template template);
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

        public bool TemplateDirectoryExist(Template template)
        {
            return _physicalFileManager.DirectoryExists(GetTemplateDirectoryPath(template));
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
                ? Path.Combine(CustomTemplatesDirectoryPath, template.Name)
                : Path.Combine(TemplatesDirectoryPath, template.Name);
        }

        private string TemplatesDirectoryPath {
            get
            {
                return Path.IsPathRooted(_configurationReader.TempateStorageConfiguration.TemplatesPath)
                    ? _configurationReader.TempateStorageConfiguration.TemplatesPath
                    : Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), _configurationReader.TempateStorageConfiguration.TemplatesPath);
            }
        }

        private string CustomTemplatesDirectoryPath
        {
            get
            {
                return Path.IsPathRooted(_configurationReader.TempateStorageConfiguration.CustomTemplatesPath)
                    ? _configurationReader.TempateStorageConfiguration.CustomTemplatesPath
                    : Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), _configurationReader.TempateStorageConfiguration.CustomTemplatesPath);
            }
        }
    }
}