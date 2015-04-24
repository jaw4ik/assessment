using easygenerator.Web.Import.Presentation.Model.ShapeElements;
using System.Collections.Generic;

namespace easygenerator.Web.Import.Presentation.Model
{
    public class Table : SlideElement
    {
        public bool IsFirstRowHeader { get; private set; }
        public bool IsFirstColumnHeader { get; private set; }
        public double Width { get; private set; }
        public double Height { get; private set; }
        public TableCell[,] Cells { get; private set; }

        public Table(double width, double height, Position position, TableCell[,] cells, bool isFirstRowHeader, bool isFirstColumnHeader)
            : base(position)
        {
            Width = width;
            Height = height;
            Cells = cells;
            IsFirstRowHeader = isFirstRowHeader;
            IsFirstColumnHeader = isFirstColumnHeader;
        }
    }

    public class TableCell
    {
        public TableCell()
        {
            Visible = true;
        }

        public IEnumerable<IShapeElement> Elements { get; set; }
        public long Width { get; set; }
        public long Height { get; set; }
        public int ColSpan { get; set; }
        public int RowSpan { get; set; }
        public bool Visible { get; set; }
    }
}