using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using easygenerator.Web.Import.Presentation.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using GraphicFrame = DocumentFormat.OpenXml.Presentation.GraphicFrame;
using GroupShape = DocumentFormat.OpenXml.Presentation.GroupShape;
using Picture = DocumentFormat.OpenXml.Presentation.Picture;
using Position = easygenerator.Web.Import.Presentation.Model.Position;
using Shape = DocumentFormat.OpenXml.Presentation.Shape;

namespace easygenerator.Web.Import.Presentation
{
    public class ShapePositionReceiver
    {
        private const int Resolution = 9525; // 1 pixel =9525 EMUs for 96 dpi

        public Position GetPosition(Shape shape, SlidePart slidePart)
        {
            var rect = GetRectFromShape(shape.ShapeProperties, shape.GetPlaceholderShape(), slidePart);
            return new Position(rect.X, rect.Y);
        }

        public Rect GetRectFromGraphicFrame(GraphicFrame graphicFrame)
        {
            if (graphicFrame.Transform != null && graphicFrame.Transform.Offset != null && graphicFrame.Transform.Extents != null)
            {
                return new Rect(
                    ConvertEmuToPx(graphicFrame.Transform.Offset.X.Value),
                    ConvertEmuToPx(graphicFrame.Transform.Offset.Y.Value),
                    ConvertEmuToPx(graphicFrame.Transform.Extents.Cx.Value),
                    ConvertEmuToPx(graphicFrame.Transform.Extents.Cy.Value)
                );
            }
            throw new InvalidOperationException("No appropriate data to evaluate graphic frame coordinates.");
        }

        public Rect GetPictureRect(Picture picture, SlidePart slidePart)
        {
            return GetRectFromShape(picture.ShapeProperties, picture.NonVisualPictureProperties.ApplicationNonVisualDrawingProperties.PlaceholderShape, slidePart);
        }

        public static Rect GetRectFromShape(ShapeProperties shapeProperties, PlaceholderShape placeholder, SlidePart slidePart)
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
            var X = (double)shapeProperties.Transform2D.Offset.X.Value;
            var Y = (double)shapeProperties.Transform2D.Offset.Y.Value;
            var cX = (double)shapeProperties.Transform2D.Extents.Cx.Value;
            var cY = (double)shapeProperties.Transform2D.Extents.Cy.Value;

            OpenXmlElement element = shapeProperties.Parent;
            while (element.Parent != null)
            {
                if (element is GroupShape)
                {
                    var transform = ((GroupShape)element).GroupShapeProperties.TransformGroup;
                    var koeffX = (double)transform.Extents.Cx / (double)transform.ChildExtents.Cx;
                    var koeffY = (double)transform.Extents.Cy / (double)transform.ChildExtents.Cy;
                    X = (X - (double)transform.ChildOffset.X.Value) * koeffX + (double)transform.Offset.X;
                    Y = (Y - (double)transform.ChildOffset.Y.Value) * koeffY + (double)transform.Offset.Y;
                    cX *= koeffX;
                    cY *= koeffY;
                }
                element = element.Parent;
            }

            return new Rect(ConvertEmuToPx(X), ConvertEmuToPx(Y), ConvertEmuToPx(cX), ConvertEmuToPx(cY));
        }

        private static Shape GetShapeFromPlaceholder(PlaceholderShape placeholder, OpenXmlElement element)
        {
            IEnumerable<Shape> shapes;

            //by id and type
            if (placeholder.Type != null && placeholder.Index != null)
            {
                shapes = element.Descendants<Shape>()
                    .Where(e => e.GetPlaceholderShape() != null &&
                        e.GetPlaceholderShape().Type != null &&
                        e.GetPlaceholderShape().Type.Value == placeholder.Type.Value &&
                        e.GetPlaceholderShape().Index != null &&
                        e.GetPlaceholderShape().Index.Value == placeholder.Index.Value)
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
                        e.GetPlaceholderShape() != null &&
                        e.GetPlaceholderShape().Type != null &&
                        (e.GetPlaceholderShape().Type.Value == placeholder.Type.Value ||
                        (e.GetPlaceholderShape() != null
                        && e.GetPlaceholderShape().IsTitle() &&
                         placeholder.IsTitle())))
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
                        e.GetPlaceholderShape() != null &&
                        e.GetPlaceholderShape().Index != null &&
                        e.GetPlaceholderShape().Index.Value == placeholder.Index.Value)
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

        public static int ConvertEmuToPx(double emu)
        {
            return (int)(emu / Resolution); // 1 pixel =9525 EMUs for 96 dpi
        }
    }
}