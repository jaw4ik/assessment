using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Components
{
    public class ReleaseNoteFileReader
    {
        private readonly PhysicalFileManager _physicalFileManager;

        private readonly string _cachedCurrentReleaseNote;

        public ReleaseNoteFileReader(PhysicalFileManager physicalFileManager)
        {
            _physicalFileManager = physicalFileManager;
        }

        public string ReadReleaseNote()
        {
            if (!string.IsNullOrEmpty(_cachedCurrentReleaseNote))
            {
                return _cachedCurrentReleaseNote;
            }

            var releaseNote = _physicalFileManager.ReadAllFromFile("");

            return releaseNote;
        }
    }
}