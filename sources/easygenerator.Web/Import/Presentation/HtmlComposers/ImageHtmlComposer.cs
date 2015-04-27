
using System;

namespace easygenerator.Web.Import.Presentation.HtmlComposers
{
    public class ImageHtmlComposer
    {
        public virtual string ComposeHtml(Model.Image image)
        {
            return String.Format("<img height=\"{0}px\" width=\"{1}px\" src=\"data:{2};base64,{3}\" />",
                image.Height, image.Width, image.ContentType, Convert.ToBase64String(image.Data));
        }
    }
}