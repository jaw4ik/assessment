using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Web.Import.Presentation.HtmlComposers;
using System;
using System.IO;

namespace easygenerator.Web.Import.Presentation
{
    public interface IPresentationCourseImporter
    {
        Course Import(Model.Presentation model, string fileName, string userName);
    }

    public class PresentationCourseImporter : IPresentationCourseImporter
    {
        private readonly IEntityFactory _entityFactory;
        private readonly ITemplateRepository _templateRepository;
        private readonly ISlideHtmlComposer _slideHtmlComposer;

        private const string DefaultSectionTitle = "Untitled section";
        private const string DefaultContentTitle = "Untitled content";

        public PresentationCourseImporter(IEntityFactory entityFactory, ITemplateRepository templateRepository, ISlideHtmlComposer slideHtmlComposer)
        {
            _entityFactory = entityFactory;
            _templateRepository = templateRepository;
            _slideHtmlComposer = slideHtmlComposer;
        }

        public Course Import(Model.Presentation model, string fileName, string userName)
        {
            var course = _entityFactory.Course(Path.GetFileNameWithoutExtension(fileName),
                _templateRepository.GetDefaultTemplate(), userName);
            var section = _entityFactory.Section(DefaultSectionTitle, userName);
            course.RelateSection(section, null, userName);

            for (var i = 0; i < model.Slides.Count; i++)
            {
                var slide = model.Slides[i];

                var content = _entityFactory.InformationContent(String.Format("{0} {1}", DefaultContentTitle, i + 1), userName);
                section.AddQuestion(content, userName);

                var slideHtml = _slideHtmlComposer.ComposeHtml(slide);
                if (String.IsNullOrEmpty(slideHtml))
                {
                    continue;
                }

                var learningContent = _entityFactory.LearningContent(slideHtml, userName);
                content.AddLearningContent(learningContent, userName);
            }

            return course;
        }
    }
}