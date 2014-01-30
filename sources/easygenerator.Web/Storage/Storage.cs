using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Channels;
using System.Web;
using easygenerator.Infrastructure;
using easygenerator.Web.Components;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Storage
{
    public interface IStorage
    {
        string GetFilePath(string fileName);
        string MapFilePath(string fileName);
        bool FileExists(string fileName);
        long GetMaxFileSize();
    }

    public class Storage : IStorage
    {
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;
        private readonly ConfigurationReader _configurationReader;
        private readonly PhysicalFileManager _physicalFileManager;

        private string FilesStoragePath
        {
            get
            {
                return Path.IsPathRooted(_configurationReader.FileStorageConfiguration.Path)
                    ? _configurationReader.FileStorageConfiguration.Path
                    : Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), _configurationReader.FileStorageConfiguration.Path);
            }
        }

        public Storage(HttpRuntimeWrapper httpRuntimeWrapper, ConfigurationReader configurationReader, PhysicalFileManager physicalFileManager)
        {
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _configurationReader = configurationReader;
            _physicalFileManager = physicalFileManager;
        }

        public string GetFilePath(string fileName)
        {
            return Path.Combine(FilesStoragePath, fileName[0].ToString(CultureInfo.InvariantCulture), fileName);
        }

        public string MapFilePath(string fileName)
        {
            var filePath = GetFilePath(fileName);

            var directoryName = Path.GetDirectoryName(filePath);
            _physicalFileManager.CreateDirectory(directoryName);

            return filePath;
        }

        public bool FileExists(string fileName)
        {
            var filePath = GetFilePath(fileName);

            return _physicalFileManager.FileExists(filePath);
        }

        public long GetMaxFileSize()
        {
            return _configurationReader.FileStorageConfiguration.MaximumFileSize;
        }
    }
}