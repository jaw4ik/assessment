using Antlr.Runtime.Misc;
using DocumentFormat.OpenXml.Packaging;
using System.Drawing;
using System.IO;

namespace easygenerator.Web.Storage
{
    public interface IFileTypeChecker
    {
        bool IsImage(Stream stream);
    }

    public class FileTypeChecker : IFileTypeChecker
    {
        public bool IsImage(Stream stream)
        {
            return CheckFileType(() => Image.FromStream(stream));
        }

        private static bool CheckFileType(Action checkAction)
        {
            try
            {
                checkAction();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}