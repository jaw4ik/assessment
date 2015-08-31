using System.IO;
using easygenerator.Infrastructure;
using easygenerator.Web.Components.Configuration;

namespace easygenerator.Web.Components
{
    public class ReleaseNoteFileReader : IReleaseNoteFileReader
    {
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly ConfigurationReader _configurationReader;
        private readonly HttpRuntimeWrapper _httpRuntimeWrapper;

        private string _cachedCurrentReleaseNote;

        private readonly string _releaseVersion;

        public ReleaseNoteFileReader(PhysicalFileManager physicalFileManager, ConfigurationReader configurationReader, HttpRuntimeWrapper httpRuntimeWrapper)
        {
            _physicalFileManager = physicalFileManager;
            _configurationReader = configurationReader;
            _httpRuntimeWrapper = httpRuntimeWrapper;
            _releaseVersion = _configurationReader.ReleaseVersion;
        }

        public string GetReleaseVersion()
        {
            return _releaseVersion;
        }

        public string Read()
        {
            if (!string.IsNullOrEmpty(_cachedCurrentReleaseNote) && _configurationReader.ReleaseVersion == _releaseVersion)
            {
                return _cachedCurrentReleaseNote;
            }

            var path = Path.Combine(_httpRuntimeWrapper.GetDomainAppPath(), "ReleaseNotes\\" + _releaseVersion + ".json");

            if (!_physicalFileManager.FileExists(path))
            {
                return null;
            }
           
            _cachedCurrentReleaseNote = _physicalFileManager.ReadAllFromFile(path);

            return _cachedCurrentReleaseNote;
        }
    }
}