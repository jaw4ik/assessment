
namespace easygenerator.Web.Import.Presentation.Model
{
    public class Image : SlideElement
    {
        public string ContentType { get; private set; }
        public byte[] Data { get; private set; }
        public double Width { get; private set; }
        public double Height { get; private set; }

        public Image(double width, double height, string contentType, byte[] data, Position position)
            : base(position)
        {
            Width = width;
            Height = height;
            ContentType = contentType;
            Data = data;
        }
    }
}