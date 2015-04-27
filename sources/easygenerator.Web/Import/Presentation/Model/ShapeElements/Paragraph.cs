using easygenerator.Web.Import.Presentation.Model.ParagraphElements;
using System.Collections.Generic;

namespace easygenerator.Web.Import.Presentation.Model.ShapeElements
{
    public class Paragraph : IShapeElement
    {
        public List<IParagraphElement> Elements { get; private set; }

        public Paragraph(IEnumerable<IParagraphElement> elements)
        {
            Elements = new List<IParagraphElement>();
            Elements.AddRange(elements);
        }
    }
}