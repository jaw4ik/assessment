using Microsoft.Owin.FileSystems;
using System.Collections.Generic;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.FileSystem
{
    public class PublicPublicationsFileSystem : PhysicalFileSystem, IFileSystem
    {
        private readonly PublicationPathProvider _pathProvider;
        private readonly IPublicationRepository _publicationRepository;

        public PublicPublicationsFileSystem(string root, PublicationPathProvider pathProvider, IPublicationRepository publicationRepository)
            : base(root)
        {
            _pathProvider = pathProvider;
            _publicationRepository = publicationRepository;
        }

        bool IFileSystem.TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            var resourcePath = GetPublicPublicationResourcePath(subpath);
            return TryGetDirectoryContents(resourcePath ?? subpath, out contents);
        }

        bool IFileSystem.TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            var resourcePath = GetPublicPublicationResourcePath(subpath);
            return TryGetFileInfo(resourcePath ?? subpath, out fileInfo);
        }

        private string GetPublicPublicationResourcePath(string subpath)
        {
            var publicPublicationPath = _pathProvider.GetPublicationFolderNameFromRequestPath(subpath);
            if (publicPublicationPath != null)
            {
                var publication = _publicationRepository.GetByPublicPath(publicPublicationPath);
                if (publication != null)
                {
                    var originalPublicationPath = subpath.Replace(publicPublicationPath, publication.Id.ToString());
                    return _pathProvider.GetPrivatePublicationSubDirectoryPath(originalPublicationPath);
                }
            }
            return null;
        }
    }
}
