
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using easygenerator.Web.Import.Presentation.Model;
using System.IO;

namespace easygenerator.Web.Import.Presentation.Mappers
{
    public class ImageMapper
    {
        private readonly ShapePositionReceiver _positionReceiver;

        public ImageMapper(ShapePositionReceiver positionReceiver)
        {
            _positionReceiver = positionReceiver;
        }

        public virtual Image Map(SlidePart slidePart, Picture picture)
        {
            var rId = picture.BlipFill.Blip.Embed.Value;
            var imagePart = (ImagePart)slidePart.GetPartById(rId);

            byte[] imageBytes;
            using (var streamReader = new MemoryStream())
            {
                imagePart.GetStream().CopyTo(streamReader);
                imageBytes = streamReader.ToArray();
            }

            var rect = _positionReceiver.GetPictureRect(picture, slidePart);
            var position = new Model.Position(rect.X, rect.Y);

            return new Image(rect.Width, rect.Height, imagePart.ContentType, imageBytes, position);
        }
    }
}