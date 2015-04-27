using easygenerator.Web.Import.Presentation.Model;
using easygenerator.Web.Import.Presentation.Model.ShapeElements;
using System;
using System.Collections.Generic;
using System.Text;

namespace easygenerator.Web.Import.Presentation.HtmlComposers
{
    public class ShapeHtmlComposer
    {
        private readonly ParagraphHtmlComposer _paragraphHtmlComposer;

        public ShapeHtmlComposer(ParagraphHtmlComposer paragraphHtmlComposer)
        {
            _paragraphHtmlComposer = paragraphHtmlComposer;
        }

        public virtual string ComposeHtml(Shape shape)
        {
            return ComposeShapeElementsHtml(shape.ShapeType, shape.Elements);
        }

        public virtual string ComposeShapeElementsHtml(ShapeTypes shapeType, IEnumerable<IShapeElement> shapeElements)
        {
            var sb = new StringBuilder();
            foreach (var shapeElement in shapeElements)
            {
                if (shapeElement is Paragraph)
                {
                    sb.Append(ComposeParagraphHtml(shapeType, shapeElement as Paragraph));
                }
                if (shapeElement is List)
                {
                    sb.Append(ComposeListHtml(shapeType, shapeElement as List));
                }
            }

            return sb.ToString();
        }

        private string ComposeParagraphHtml(ShapeTypes shapeType, Paragraph paragraph)
        {
            return _paragraphHtmlComposer.ComposeHtml(shapeType, paragraph);
        }

        private string ComposeListHtml(ShapeTypes shapeType, List list)
        {
            var sb = new StringBuilder();
            var listTag = list.ListType == ListTypes.Ordered ? "ol" : "ul";
            sb.Append(String.Format("<{0}>", listTag));

            foreach (var listElement in list.Elements)
            {
                sb.Append("<li>");
                sb.Append(_paragraphHtmlComposer.ComposeInnerHtml(listElement.Paragraph, ParagraphBreaks.Br));

                foreach (var nestedList in listElement.NestedLists)
                {
                    sb.Append(ComposeListHtml(shapeType, nestedList));
                }

                sb.Append("</li>");
            }

            sb.Append(String.Format("</{0}>", listTag));
            return sb.ToString();
        }
    }
}