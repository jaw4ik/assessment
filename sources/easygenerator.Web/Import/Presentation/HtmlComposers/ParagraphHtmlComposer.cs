using easygenerator.Web.Import.Presentation.Model;
using easygenerator.Web.Import.Presentation.Model.ParagraphElements;
using easygenerator.Web.Import.Presentation.Model.ShapeElements;
using System;
using System.Text;
using System.Web;

namespace easygenerator.Web.Import.Presentation.HtmlComposers
{
    public class ParagraphHtmlComposer
    {
        public string ComposeHtml(ShapeTypes shapeType, Paragraph paragraph)
        {
            var wrappingTagName = GetWrappringTagName(shapeType);
            var paragraphBreak = GetParagraphBreak(shapeType);

            var sb = new StringBuilder();

            sb.Append(String.Format("<{0}>", wrappingTagName));
            sb.Append(ComposeInnerHtml(paragraph, paragraphBreak));
            sb.Append(String.Format("</{0}>", wrappingTagName));

            return sb.ToString();
        }

        public string ComposeInnerHtml(Paragraph paragraph, ParagraphBreaks paragraphBreak)
        {
            var sb = new StringBuilder();
            foreach (var element in paragraph.Elements)
            {
                if (element is HyperlinkParagraphElement)
                {
                    sb.Append(ComposeHyperlinkHtml(element as HyperlinkParagraphElement));
                    continue;
                }
                if (element is TextParagraphElement)
                {
                    sb.Append(ComposeTextHtml(element as TextParagraphElement));
                    continue;
                }
                if (element is BreakParagraphElement)
                {
                    sb.Append(GetParagraphBreakHtml(paragraphBreak));
                }
            }

            return sb.ToString();
        }

        private string ComposeHyperlinkHtml(HyperlinkParagraphElement paragraphElement)
        {
            var sb = new StringBuilder();
            sb.Append(String.Format("<a href=\"{0}\" target=\"_blank\">", paragraphElement.Uri.AbsoluteUri));
            paragraphElement.Elements.ForEach(e => sb.Append(ComposeTextHtml(e)));
            sb.Append("</a>");

            return sb.ToString();
        }

        private string ComposeTextHtml(TextParagraphElement paragraphElement)
        {
            var html = HttpUtility.HtmlEncode(paragraphElement.Text);
            if (paragraphElement.Style.Bold)
            {
                html = String.Format("<strong>{0}</strong>", html);
            }

            if (paragraphElement.Style.Italic)
            {
                html = String.Format("<em>{0}</em>", html);

            }
            if (paragraphElement.Style.Underline)
            {
                html = String.Format("<u>{0}</u>", html);
            }

            return html;
        }

        private string GetWrappringTagName(ShapeTypes shapeType)
        {
            if (shapeType == ShapeTypes.Title)
                return "h1";

            if (shapeType == ShapeTypes.Subtitle)
                return "h2";

            return "p";
        }

        private ParagraphBreaks GetParagraphBreak(ShapeTypes shapeType)
        {
            return shapeType == ShapeTypes.Normal ? ParagraphBreaks.NewParagraph : ParagraphBreaks.Br;
        }

        private string GetParagraphBreakHtml(ParagraphBreaks paragraphBreak)
        {
            return paragraphBreak == ParagraphBreaks.NewParagraph ? "</p><p>" : "</br>";
        }
    }

    public enum ParagraphBreaks
    {
        NewParagraph,
        Br
    }
}