using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Storage;

namespace easygenerator.Web.Components
{
    public class ManifestFileManager
    {
        private readonly PhysicalFileManager _physicalFileManager;
        private readonly ITemplateStorage _templateStorage;

        private const string ManifestFileName = "manifest.json";
        private readonly ConcurrentDictionary<Guid, string> _cachedManifestsDictionary;

        public ManifestFileManager(PhysicalFileManager physicalFileManager, ITemplateStorage templateStorage)
        {
            _physicalFileManager = physicalFileManager;
            _templateStorage = templateStorage;

            _cachedManifestsDictionary = new ConcurrentDictionary<Guid, string>();
        }

        public string ReadManifest(Template template)
        {
            if (_cachedManifestsDictionary.ContainsKey(template.Id))
            {
                return _cachedManifestsDictionary[template.Id];
            }

            if (!_templateStorage.FileExists(template, ManifestFileName))
            {
                return null;
            }

            var manifestFilePath = _templateStorage.GetAbsoluteFilePath(template, ManifestFileName);
            var manifestData = _physicalFileManager.ReadAllFromFile(manifestFilePath);
            _cachedManifestsDictionary.TryAdd(template.Id, manifestData);

            return manifestData;
        }
    }
}
