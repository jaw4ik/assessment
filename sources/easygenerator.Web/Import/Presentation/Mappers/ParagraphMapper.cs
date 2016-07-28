using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Packaging;
using easygenerator.Web.Import.Presentation.Model.ParagraphElements;
using System;
using System.Collections.Generic;
using System.Linq;
using Paragraph = DocumentFormat.OpenXml.Drawing.Paragraph;

namespace easygenerator.Web.Import.Presentation.Mappers
{
    public class ParagraphMapper
    {
        public virtual Model.ShapeElements.Paragraph Map(SlidePart slidePart, Paragraph paragraph)
        {
            return new Model.ShapeElements.Paragraph(GetParagraphElements(slidePart, paragraph));
        }

        private IEnumerable<IParagraphElement> GetParagraphElements(SlidePart slidePart, Paragraph paragraph)
        {
            var elements = new List<IParagraphElement>();
            HyperlinkParagraphElement hyperlinkParagraph = null;
            foreach (var element in paragraph.ChildElements)
            {
                if (element is Run)
                {
                    var run = element as Run;

                    var hyperlinkId = GetRunHyperlinkId(run);
                    if (hyperlinkId != null)
                    {
                        var uri = GetHyperlinkUri(slidePart, hyperlinkId);
                        if (IsValidHyperlink(uri))
                        {
                            if (hyperlinkParagraph == null || hyperlinkParagraph.Id != hyperlinkId)
                            {
                                hyperlinkParagraph = new HyperlinkParagraphElement(hyperlinkId, uri);
                                elements.Add(hyperlinkParagraph);
                            }

                            hyperlinkParagraph.Elements.Add(MapTextElement(run));
                            continue;
                        }
                    }

                    hyperlinkParagraph = null;
                    elements.Add(MapTextElement(run));
                }
                if (element is Break)
                {
                    elements.Add(new BreakParagraphElement());
                }
            }

            return elements;
        }

        private TextParagraphElement MapTextElement(Run run)
        {
            var properties = run.RunProperties ?? new RunProperties();
            var style = new TextStyle()
            {
                Bold = properties.Bold != null && properties.Bold != "0",
                Italic = properties.Italic != null && properties.Italic != "0",
                Underline = properties.Underline != null && properties.Underline.HasValue && properties.Underline.Value != TextUnderlineValues.None
            };

            return new TextParagraphElement { Text = run.InnerText, Style = style };
        }

        private bool IsValidHyperlink(Uri uri)
        {
            return uri.IsAbsoluteUri && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
        }

        private string GetRunHyperlinkId(Run element)
        {
            var property = element.RunProperties?.Elements<HyperlinkOnClick>().FirstOrDefault();
            if (property == null || String.IsNullOrWhiteSpace(property.Id))
                return null;

            return property.Id;
        }

        private static Uri GetHyperlinkUri(SlidePart slidePart, string id)
        {
            var relation = slidePart.HyperlinkRelationships.FirstOrDefault(e => e.Id.Equals(id));
            return relation == null ? null : relation.Uri;
        }

    }
}