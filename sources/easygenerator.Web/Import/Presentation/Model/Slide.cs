using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using DocumentFormat.OpenXml.Office.CustomUI;
using easygenerator.Infrastructure;

namespace easygenerator.Web.Import.Presentation.Model
{
    public class Slide
    {
        protected internal ICollection<Shape> ShapesCollection { get; set; }

        public IEnumerable<Shape> Shapes
        {
            get { return ShapesCollection.OrderBy(item => item.Position.Y).ThenBy(item => item.Position.X).AsEnumerable(); }
        }

        public Slide()
        {
            ShapesCollection = new Collection<Shape>();
        }

        public void AddShape(Shape shape)
        {
            ThrowIfShapeIsInvalid(shape);
            ShapesCollection.Add(shape);
        }

        private void ThrowIfShapeIsInvalid(Shape shape)
        {
            ArgumentValidation.ThrowIfNull(shape, "shape");
        }
    }
}