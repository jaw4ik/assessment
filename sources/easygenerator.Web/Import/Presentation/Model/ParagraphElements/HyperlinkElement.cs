using System;
using System.Collections.Generic;

namespace easygenerator.Web.Import.Presentation.Model.ParagraphElements
{
    public class HyperlinkParagraphElement : IParagraphElement
    {
        public Uri Uri { get; set; }
        public string Id { get; set; }

        public List<TextParagraphElement> Elements { get; private set; }

        public HyperlinkParagraphElement(string id, Uri uri)
        {
            Elements = new List<TextParagraphElement>();
            Uri = uri;
            Id = id;
        }
    }
}