using Microsoft.Owin.FileSystems;
using System.Collections.Generic;
using easygenerator.PublicationServer.DataAccess;
using easygenerator.PublicationServer.Search;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.FileSystem
{
    public class PublicPublicationsFileSystem : PhysicalFileSystem, IFileSystem
    {
        private readonly PublicationPathProvider _pathProvider;
        private readonly IPublicationRepository _publicationRepository;
        private readonly HttpUtilityWrapper _httpUtilityWrapper;
        private readonly SearchManager _searchManager;

        public PublicPublicationsFileSystem(string root, PublicationPathProvider pathProvider, IPublicationRepository publicationRepository,
            HttpUtilityWrapper httpUtilityWrapper, SearchManager searchManager)
            : base(root)
        {
            _pathProvider = pathProvider;
            _publicationRepository = publicationRepository;
            _httpUtilityWrapper = httpUtilityWrapper;
            _searchManager = searchManager;
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
            subpath = _httpUtilityWrapper.UrlDecode(subpath);
            var publicPublicationPath = _pathProvider.GetPublicationFolderNameFromRequestPath(subpath);
            if (publicPublicationPath != null)
            {
                var publication = _publicationRepository.GetByPublicPath(publicPublicationPath);
                if (_searchManager.AllowedToBeIndexed(publication))
                {
                    var originalPublicationPath = subpath.Replace(publicPublicationPath, publication.Id.ToString());
                    return _pathProvider.GetPrivatePublicationSubDirectoryPath(originalPublicationPath);
                }
            }
            return null;
        }
    }
}
