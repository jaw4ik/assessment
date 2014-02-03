using System.Drawing;
using System.IO;

namespace easygenerator.Web.Storage
{
    public interface IImageValidator
    {
        bool IsImage(Stream stream);
    }

    public class ImageValidator : IImageValidator
    {
        public bool IsImage(Stream stream)
        {
            try
            {
                var bitmap = Image.FromStream(stream);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}