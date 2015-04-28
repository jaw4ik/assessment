using easygenerator.Web.Import.Presentation.Model;
using System;
using System.Linq;
using System.Text;

namespace easygenerator.Web.Import.Presentation.HtmlComposers
{
    public interface ISlideHtmlComposer
    {
        string ComposeHtml(Slide slide);
    }

    public class SlideHtmlComposer : ISlideHtmlComposer
    {
        private readonly ShapeHtmlComposer _shapeHtmlComposer;
        private readonly ImageHtmlComposer _imageeHtmlComposer;
        private readonly TableHtmlComposer _tableHtmlComposer;

        public SlideHtmlComposer(ShapeHtmlComposer shapeHtmlComposer, ImageHtmlComposer imageHtmlComposer, TableHtmlComposer tableHtmlComposer)
        {
            _shapeHtmlComposer = shapeHtmlComposer;
            _imageeHtmlComposer = imageHtmlComposer;
            _tableHtmlComposer = tableHtmlComposer;
        }

        public virtual string ComposeHtml(Slide slide)
        {
            if (!slide.Elements.Any())
            {
                return String.Empty;
            }

            var sb = new StringBuilder();
            var elements = slide.Elements.OrderBy(item => item.Position.Y).ThenBy(item => item.Position.X);

            foreach (var element in elements)
            {
                if (element is Shape)
                {
                    sb.Append(_shapeHtmlComposer.ComposeHtml(element as Shape));
                }
                if (element is Image)
                {
                    sb.Append(_imageeHtmlComposer.ComposeHtml(element as Image));
                }
                if (element is Table)
                {
                    sb.Append(_tableHtmlComposer.ComposeHtml(element as Table));
                }
            }

            return sb.ToString();
        }
    }
}