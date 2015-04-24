using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.Web.Import.Presentation.Model
{
    public class Slide
    {
        public List<SlideElement> Elements { get; private set; }
        
        public Slide()
        {
            Elements = new List<SlideElement>();
        }

        public void AddElement(SlideElement element)
        {
            ThrowIfShapeIsInvalid(element);
            Elements.Add(element);
        }

        private void ThrowIfShapeIsInvalid(SlideElement element)
        {
            ArgumentValidation.ThrowIfNull(element, "element");
        }
    }
}