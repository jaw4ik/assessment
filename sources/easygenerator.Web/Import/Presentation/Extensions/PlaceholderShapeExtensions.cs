using DocumentFormat.OpenXml.Presentation;

namespace easygenerator.Web.Import.Presentation.Extensions
{
    public static class PlaceholderShapeExtensions
    {
        public static bool IsTitle(this PlaceholderShape placeholderShape)
        {
            if (placeholderShape == null || placeholderShape.Type == null || !placeholderShape.Type.HasValue)
                return false;

            var type = (PlaceholderValues)placeholderShape.Type;
            return type == PlaceholderValues.Title || type == PlaceholderValues.CenteredTitle;
        }

        public static bool IsSubTitle(this PlaceholderShape placeholderShape)
        {
            if (placeholderShape == null || placeholderShape.Type == null || !placeholderShape.Type.HasValue)
                return false;

            var type = (PlaceholderValues)placeholderShape.Type;
            return type == PlaceholderValues.SubTitle;
        }

        public static bool IsIndexDefined(this PlaceholderShape placeholderShape)
        {
            return placeholderShape.Index != null && placeholderShape.Index.HasValue;
        }

        public static bool IsTypeDefined(this PlaceholderShape placeholderShape)
        {
            return placeholderShape.Type != null && placeholderShape.Type.HasValue;
        }
    }
}