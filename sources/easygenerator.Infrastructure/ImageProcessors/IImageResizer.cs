using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ImageMagick;

namespace easygenerator.Infrastructure.ImageProcessors
{
    public interface IImageResizer
    {
        byte[] ResizeImage(string path, int width, int height, bool scaleBySmallerSide);
    }
}
