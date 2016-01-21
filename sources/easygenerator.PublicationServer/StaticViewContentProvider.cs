using System.Collections.Generic;
using easygenerator.PublicationServer.FileSystem;

namespace easygenerator.PublicationServer
{
    public class StaticViewContentProvider
    {
        private Dictionary<string, string> _viewsContent  = new Dictionary<string, string>();
        private readonly PublicationPathProvider _publishPathProvider;
        private readonly PhysicalFileManager _fileManager;

        public StaticViewContentProvider(PublicationPathProvider publishPathProvider, PhysicalFileManager fileManager)
        {
            _publishPathProvider = publishPathProvider;
            _fileManager = fileManager;
        }

        public string GetViewContent(string viewName)
        {
            if (!_viewsContent.ContainsKey(viewName))
            {
                _viewsContent[viewName] = _fileManager.ReadAllFromFile(_publishPathProvider.GetStaticViewLocation(viewName));
            }
            return _viewsContent[viewName];
        }
    }
}
