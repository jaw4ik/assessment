using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Packaging;
using easygenerator.Web.Import.Presentation.Extensions;
using easygenerator.Web.Import.Presentation.Model;
using Shape = DocumentFormat.OpenXml.Presentation.Shape;

namespace easygenerator.Web.Import.Presentation.Mappers
{
    public class ShapeMapper
    {
        private readonly ShapePositionReceiver _positionReceiver;
        private readonly ParagraphCollectionMapper _paragraphCollectionMapper;

        public ShapeMapper(ShapePositionReceiver positionReceiver, ParagraphCollectionMapper paragraphCollectionMapper)
        {
            _positionReceiver = positionReceiver;
            _paragraphCollectionMapper = paragraphCollectionMapper;
        }

        public virtual Model.Shape Map(SlidePart slidePart, Shape shape)
        {
            return new Model.Shape(GetShapeType(shape),
                _paragraphCollectionMapper.Map(slidePart, shape.Descendants<Paragraph>(), shape.IsContentPlaceholder()),
                 _positionReceiver.GetPosition(shape, slidePart));
        }

        private ShapeTypes GetShapeType(Shape shape)
        {
            if (shape.IsTitle())
                return ShapeTypes.Title;

            if (shape.IsSubTitle())
                return ShapeTypes.Subtitle;

            return ShapeTypes.Normal;
        }
    }
}