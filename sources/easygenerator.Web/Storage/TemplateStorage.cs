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
        private readonly ILog _logger;

        public TemplateStorage(ConfigurationReader configurationReader, HttpRuntimeWrapper httpRuntimeWrapper, PhysicalFileManager physicalFileManager, ILog logger)
        {
            _configurationReader = configurationReader;
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _physicalFileManager = physicalFileManager;
            _logger = logger;
        }

        public bool TemplateDirectoryExist(Template template)
        {
            var templateDirectoryPath = GetTemplateDirectoryPath(template);
            var exists = _physicalFileManager.DirectoryExists(templateDirectoryPath);

            if (!exists)
            {
                _logger.LogException(new DirectoryNotFoundException("Template directory not found. Path: " + templateDirectoryPath));
            }

            return exists;
        }

        public bool FileExists(Template template, string filePath)
        {
            var absoluteFilePath = GetAbsoluteFilePath(template, filePath);
            var exists = _physicalFileManager.FileExists(absoluteFilePath);

            if (!exists)
            {
                _logger.LogException(new FileNotFoundException("Template file not found. Path: " + absoluteFilePath, filePath));
            }

            return exists;
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