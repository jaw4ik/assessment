using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using GroupShape = DocumentFormat.OpenXml.Presentation.GroupShape;
using ModelShape = easygenerator.Web.Import.Presentation.Model.Shape;
using Picture = DocumentFormat.OpenXml.Presentation.Picture;
using Position = easygenerator.Web.Import.Presentation.Model.Position;
using Shape = DocumentFormat.OpenXml.Presentation.Shape;

namespace easygenerator.Web.Import.Presentation
{
    public class ShapePositionReceiver
    {
        private const int Resolution = 9525; // 1 pixel =9525 EMUs for 96 dpi

        public static Position GetPosition(Shape shape, SlidePart slidePart)
        {
            var rect = GetRectFromShape(shape.ShapeProperties, shape.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape, slidePart);
            return new Position(rect.X, rect.Y);
        }

        public static Rect GetPictureRect(Picture picture, SlidePart slidePart)
        {
            return GetRectFromShape(picture.ShapeProperties, picture.NonVisualPictureProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape, slidePart);
        }

        public static Rect GetRectFromShape(DocumentFormat.OpenXml.Presentation.ShapeProperties shapeProperties, PlaceholderShape placeholder, SlidePart slidePart)
        {
            if (CanGetRectFromShape(shapeProperties))
            {
                return GetRectFromShapeProperties(shapeProperties);
            }

            if (placeholder == null)
            {
                return new Rect(0, 0, 0, 0);
            }

            var layoutShape = GetShapeFromPlaceholder(placeholder, slidePart.SlideLayoutPart.SlideLayout);
            if (layoutShape != null && CanGetRectFromShape(layoutShape.ShapeProperties))
            {
                return GetRectFromShapeProperties(layoutShape.ShapeProperties);
            }

            var slideMasterShape = GetShapeFromPlaceholder(placeholder, slidePart.SlideLayoutPart.SlideMasterPart.SlideMaster);
            if (slideMasterShape != null && CanGetRectFromShape(slideMasterShape.ShapeProperties))
            {
                return GetRectFromShapeProperties(slideMasterShape.ShapeProperties);
            }

            return new Rect(0, 0, 0, 0);
        }

        private static bool CanGetRectFromShape(DocumentFormat.OpenXml.Presentation.ShapeProperties shapeProperties)
        {
            return shapeProperties.Transform2D != null && shapeProperties.Transform2D.Offset != null && shapeProperties.Transform2D.Extents != null;
        }

        private static Rect GetRectFromShapeProperties(DocumentFormat.OpenXml.Presentation.ShapeProperties shapeProperties)
        {
            double X = (double)shapeProperties.Transform2D.Offset.X.Value;
            double Y = (double)shapeProperties.Transform2D.Offset.Y.Value;
            double cX = (double)shapeProperties.Transform2D.Extents.Cx.Value;
            double cY = (double)shapeProperties.Transform2D.Extents.Cy.Value;

            OpenXmlElement element = shapeProperties.Parent;
            while (element.Parent != null)
            {
                if (element is GroupShape)
                {
                    TransformGroup transform = ((GroupShape)element).GroupShapeProperties.TransformGroup;
                    double koeffX = (double)transform.Extents.Cx / (double)transform.ChildExtents.Cx;
                    double koeffY = (double)transform.Extents.Cy / (double)transform.ChildExtents.Cy;
                    X = (X - (double)transform.ChildOffset.X.Value) * koeffX + (double)transform.Offset.X;
                    Y = (Y - (double)transform.ChildOffset.Y.Value) * koeffY + (double)transform.Offset.Y;
                    cX *= koeffX;
                    cY *= koeffY;
                }
                element = element.Parent;
            }

            return new Rect(ConvertEmuToPx(X), ConvertEmuToPx(Y), ConvertEmuToPx(cX), ConvertEmuToPx(cY));
        }

        private static Shape GetShapeFromPlaceholder( PlaceholderShape placeholder, OpenXmlElement element)
        {
            IEnumerable<Shape> shapes;

            //by id and type
            if (placeholder.Type != null && placeholder.Index != null)
            {
                shapes = element.Descendants<Shape>()
                    .Where(e => e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Type != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Type.Value == placeholder.Type.Value &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Index != null &&
                        e.NonVisualShapeProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape.Index.Value == placeholder.Index.Value)
                    .Select(e => e);

                if (shapes.Count() > 1)
                {
                    throw new InvalidOperationException();
                }

                if (shapes.Any())
                {
                    return shapes.First();
                }

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
                {
                    throw new InvalidOperationException();
                }

                if (shapes.Any())
                {
                    return shapes.First();
                }

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
                {
                    throw new InvalidOperationException();
                }

                if (shapes.Any())
                {
                    return shapes.First();
                }

            }

            return null;
        }

        private static int ConvertEmuToPx(double emu)
        {
            return (int)(emu / Resolution); // 1 pixel =9525 EMUs for 96 dpi
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