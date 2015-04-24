using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Drawing;
using System.Linq;

namespace easygenerator.Web.Import.Presentation.Extensions
{
    public static class ParagraphExtensions
    {
        public static bool HasPropertyElement<T>(this Paragraph paragraph)
           where T : OpenXmlElement
        {
            return paragraph.ParagraphProperties != null && paragraph.ParagraphProperties.Elements<T>().Any();
        }

        public static bool IsOrderedListElement(this Paragraph paragraph)
        {
            return paragraph.HasPropertyElement<AutoNumberedBullet>();
        }

        public static bool IsUnorderedListElement(this Paragraph paragraph)
        {
            return paragraph.HasPropertyElement<CharacterBullet>();
        }

        public static bool IsNoBulletElement(this Paragraph paragraph)
        {
            return paragraph.HasPropertyElement<NoBullet>();
        }

        public static int GetLevel(this Paragraph paragraph)
        {
            return paragraph.ParagraphProperties != null && paragraph.ParagraphProperties.Level != null
                && paragraph.ParagraphProperties.Level.HasValue ? paragraph.ParagraphProperties.Level.Value : 0;
        }
    }
}