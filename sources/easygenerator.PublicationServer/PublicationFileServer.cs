using Microsoft.Owin.FileSystems;
using System.Collections.Generic;

namespace easygenerator.PublicationServer
{
    public class PublicationFileServer : PhysicalFileSystem, IFileSystem
    {
        private readonly PublicationPathProvider _pathProvider;

        public PublicationFileServer(string root, PublicationPathProvider pathProvider)
            : base(root)
        {
            _pathProvider = pathProvider;
        }

        bool IFileSystem.TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            subpath = _pathProvider.GetPublicationSubDirectoryPath(subpath);
            return TryGetDirectoryContents(subpath, out contents);
        }

        bool IFileSystem.TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            subpath = _pathProvider.GetPublicationSubDirectoryPath(subpath);
            return TryGetFileInfo(subpath, out fileInfo);
        }
    }
}
