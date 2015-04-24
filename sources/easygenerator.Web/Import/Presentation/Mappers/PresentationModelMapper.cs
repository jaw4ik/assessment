using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using System.IO;
using System.Linq;
using Slide = easygenerator.Web.Import.Presentation.Model.Slide;

namespace easygenerator.Web.Import.Presentation.Mappers
{
    public interface IPresentationModelMapper
    {
        Model.Presentation Map(Stream stream);
    }

    public class PresentationModelMapper : IPresentationModelMapper
    {
        private readonly ShapeMapper _shapeMapper;
        private readonly ImageMapper _imageMapper;
        private readonly TableMapper _tableMapper;

        public PresentationModelMapper(ShapeMapper shapeMapper, ImageMapper imageMapper, TableMapper tableMapper)
        {
            _shapeMapper = shapeMapper;
            _imageMapper = imageMapper;
            _tableMapper = tableMapper;
        }

        public Model.Presentation Map(Stream stream)
        {
            PresentationDocument document = null;
            try
            {
                document = PresentationDocument.Open(stream, false);
                if (document == null)
                {
                    return null;
                }

                var presentation = new Model.Presentation();

                if (document.PresentationPart == null || !document.PresentationPart.SlideParts.Any())
                {
                    return presentation;
                }

                MapSlides(document, presentation);

                return presentation;
            }
            catch
            {
                return null;
            }
            finally
            {
                if (document != null)
                {
                    document.Close();
                    document.Dispose();
                }
            }
        }

        private void MapSlides(PresentationDocument document, Model.Presentation presentation)
        {
            foreach (var item in document.PresentationPart.Presentation.SlideIdList.Elements<SlideId>())
            {
                var slidePart = document.PresentationPart.GetPartById(item.RelationshipId) as SlidePart;

                if (slidePart == null)
                {
                    continue;
                }

                var slide = new Slide();

                foreach (var slideElement in slidePart.Slide.Descendants())
                {
                    if (slideElement is Shape)
                    {
                        slide.AddElement(_shapeMapper.Map(slidePart, (Shape)slideElement));
                    }
                    else if (slideElement is Picture)
                    {
                        slide.AddElement(_imageMapper.Map(slidePart, (Picture)slideElement));
                    }
                    else if (slideElement is GraphicFrame)
                    {
                        var graphicFrame = (GraphicFrame)slideElement;
                        // determine if there is a table in graphic frame. Graphic frame is also using for charts etc.
                        if (graphicFrame.Descendants<DocumentFormat.OpenXml.Drawing.Table>().Any())
                        {
                            slide.AddElement(_tableMapper.Map(slidePart, graphicFrame));
                        }
                    }
                }

                presentation.Slides.Add(slide);
            }
        }
    }
}