using DocumentFormat.OpenXml.Presentation;
using Shape = DocumentFormat.OpenXml.Presentation.Shape;

namespace easygenerator.Web.Import.Presentation.Extensions
{
    public static class ShapeExtensions
    {
        public static bool IsTitle(this Shape shape)
        {
            var placeholder = shape.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape;
            return placeholder != null && placeholder.IsTitle();
        }

        public static bool IsSubTitle(this Shape shape)
        {
            var placeholder = shape.GetPlaceholderShape();
            return placeholder != null && placeholder.IsSubTitle();
        }

        public static PlaceholderShape GetPlaceholderShape(this Shape shape)
        {
            return shape.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape;
        }

        public static bool IsContentPlaceholder(this Shape shape)
        {
            var placeholder = shape.GetPlaceholderShape();
            if (placeholder == null)
                return false;

            return placeholder.IsIndexDefined() && !placeholder.IsTypeDefined();
        }
    }
}