using System.Collections.Generic;

namespace easygenerator.Web.Import.Presentation.Model
{
    public class Shape : SlideElement
    {
        public IEnumerable<IShapeElement> Elements { get; private set; }
        public ShapeTypes ShapeType { get; private set; }

        public Shape(ShapeTypes shapeType, IEnumerable<IShapeElement> elements, Position position)
            : base(position)
        {
            Elements = elements;
            ShapeType = shapeType;
        }
    }

    public enum ShapeTypes
    {
        Title,
        Subtitle,
        Normal
    }
}