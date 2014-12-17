using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace easygenerator.Infrastructure
{
    public class ManifestFileManager
    {
        private const string Manifest = "manifest.json";
        private readonly PhysicalFileManager _physicalFileManager;
        public Dictionary<Guid, string> ManifestDictionary = new Dictionary<Guid, string>();

        public ManifestFileManager(PhysicalFileManager physicalFileManager)
        {
            _physicalFileManager = physicalFileManager;
        }

        public string ReadManifest(Guid templateId, string pathToTemplate)
        {
            var manifestExist = ManifestDictionary.Any(m => m.Key == templateId);
            if (manifestExist)
            {
                return ManifestDictionary.FirstOrDefault(m => m.Key == templateId).Value;
            }
            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, pathToTemplate.Replace("/", "\\").Substring(1) + Manifest);
            var readManifest = _physicalFileManager.ReadAllFromFile(path);
            ManifestDictionary.Add(templateId, readManifest);
            return readManifest;
        }
    }
}
