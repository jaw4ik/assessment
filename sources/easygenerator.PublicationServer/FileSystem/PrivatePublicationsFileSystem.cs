using Microsoft.Owin.FileSystems;
using System.Collections.Generic;
using easygenerator.PublicationServer.Utils;

namespace easygenerator.PublicationServer.FileSystem
{
    public class PrivatePublicationsFileSystem : PhysicalFileSystem, IFileSystem
    {
        private readonly PublicationPathProvider _pathProvider;

        public PrivatePublicationsFileSystem(string root, PublicationPathProvider pathProvider)
            : base(root)
        {
            _pathProvider = pathProvider;
        }

        bool IFileSystem.TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            subpath = _pathProvider.GetPrivatePublicationSubDirectoryPath(subpath);
            return TryGetDirectoryContents(subpath, out contents);
        }

        bool IFileSystem.TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            subpath = _pathProvider.GetPrivatePublicationSubDirectoryPath(subpath);
            return TryGetFileInfo(subpath, out fileInfo);
        }
    }
}
