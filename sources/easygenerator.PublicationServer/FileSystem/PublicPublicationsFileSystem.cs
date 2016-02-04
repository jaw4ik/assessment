using System;
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
        private readonly HttpUtilityWrapper _httpUtilityWrapper;
        private readonly IUserRepository _userRepository;

        public PublicPublicationsFileSystem(string root, PublicationPathProvider pathProvider, IPublicationRepository publicationRepository,
            HttpUtilityWrapper httpUtilityWrapper, IUserRepository userRepository)
            : base(root)
        {
            _pathProvider = pathProvider;
            _publicationRepository = publicationRepository;
            _httpUtilityWrapper = httpUtilityWrapper;
            _userRepository = userRepository;
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
                if (publication != null)
                {
                    var owner = _userRepository.Get(publication.OwnerEmail);
                    if (owner != null && owner.AccessType == Constants.Search.SearchableAccessType
                        && (DateTimeWrapper.Now() - owner.ModifiedOn) >
                        TimeSpan.FromDays(Constants.Search.SearchableAccessTypeMinDaysPeriod))
                    {
                        var originalPublicationPath = subpath.Replace(publicPublicationPath, publication.Id.ToString());
                        return _pathProvider.GetPrivatePublicationSubDirectoryPath(originalPublicationPath);
                    }
                }
            }
            return null;
        }
    }
}
