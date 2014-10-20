using System;
using System.Collections.Generic;
using System.Linq;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using GroupShape = DocumentFormat.OpenXml.Presentation.GroupShape;
using ModelShape = easygenerator.Web.Import.Presentation.Model.Shape;
using Position = easygenerator.Web.Import.Presentation.Model.Position;

namespace easygenerator.Web.Import.Presentation
{
    public class ShapePositionReceiver
    {
        public static Position GetPosition(Shape shape, SlidePart slidePart)
        {
            var position = GetPositionFromShape(shape) ??
                            GetPositionFromLayoutPart(shape, slidePart.SlideLayoutPart.SlideLayout) ??
                            GetPositionFromLayoutPart(shape, slidePart.SlideLayoutPart.SlideMasterPart.SlideMaster) ??
                            new Position(0, 0);

            return position;
        }

        private static Position GetPositionFromLayoutPart(Shape shape, DocumentFormat.OpenXml.OpenXmlElement element)
        {
            var placeholder = shape.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape;

            if (placeholder == null)
                return null;

            IEnumerable<Shape> shapes;

            //by id and type
            if (placeholder.Type != null && placeholder.Index != null)
            {
                shapes = element.Descendants<Shape>()
                    .Where(e =>
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Type != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Type.Value == placeholder.Type.Value &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Index != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Index.Value == placeholder.Index.Value)
                    .Select(e => e);

                if (shapes.Count() > 1)
                    throw new InvalidOperationException();

                if (shapes.Any() && shapes.First() != null)
                    return GetPositionFromShape(shapes.First());
            }

            //by type
            if (placeholder.Type != null)
            {
                shapes = element.Descendants<Shape>()
                    .Where(e =>
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Type != null &&
                        (e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Type.Value == placeholder.Type.Value ||
                        (IsTitlePlaceholder(placeholder) &&
                        IsTitlePlaceholder(e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape))))
                    .Select(e => e);

                if (shapes.Count() > 1)
                    throw new InvalidOperationException();

                if (shapes.Any() && shapes.First() != null)
                    return GetPositionFromShape(shapes.First());
            }

            //by id
            if (placeholder.Index != null)
            {
                shapes = element.Descendants<Shape>()
                    .Where(e =>
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Index != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Index.Value == placeholder.Index.Value)
                    .Select(e => e);

                if (shapes.Count() > 1)
                    throw new InvalidOperationException();

                if (shapes.Any() && shapes.First() != null)
                    return GetPositionFromShape(shapes.First());
            }

            return null;
        }

        private static Position GetPositionFromShape(Shape shape)
        {
            var prop = shape.ShapeProperties;
            if (prop.Transform2D == null || prop.Transform2D.Offset == null || prop.Transform2D.Extents == null)
                return null;

            var x = (double)prop.Transform2D.Offset.X.Value;
            var y = (double)prop.Transform2D.Offset.Y.Value;

            var element = prop.Parent;
            while (element.Parent != null)
            {
                var groupShape = element as GroupShape;
                if (groupShape != null)
                {
                    var transform = groupShape.GroupShapeProperties.TransformGroup;
                    var koeffX = transform.Extents.Cx / transform.ChildExtents.Cx;
                    var koeffY = transform.Extents.Cy / transform.ChildExtents.Cy;
                    x = (x - transform.ChildOffset.X.Value) * koeffX + transform.Offset.X;
                    y = (y - transform.ChildOffset.Y.Value) * koeffY + transform.Offset.Y;
                }
                element = element.Parent;
            }

            return new Position(x, y);
        }

        private static bool IsTitlePlaceholder(PlaceholderShape placeholderShape)
        {
            if (placeholderShape == null || placeholderShape.Type == null || !placeholderShape.Type.HasValue)
                return false;

            switch ((PlaceholderValues)placeholderShape.Type)
            {
                case PlaceholderValues.Title:

                case PlaceholderValues.CenteredTitle:
                    return true;

                default:
                    return false;
            }
        }
    }
}