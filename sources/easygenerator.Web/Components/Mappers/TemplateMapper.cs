using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class TemplateMapper : IEntityModelMapper<Template>
    {
        private readonly ManifestFileManager _manifestFileManager;

        public TemplateMapper(ManifestFileManager manifestFileManager)
        {
            _manifestFileManager = manifestFileManager;
        }

        public dynamic Map(Template template)
        {
            return new
            {
                Id = template.Id.ToNString(),
                Manifest = _manifestFileManager.ReadManifest(template.Id, template.PreviewUrl),
                PreviewDemoUrl = template.PreviewUrl,
                Order = template.Order,
                IsCustom = template.IsCustom,
                IsNew = template.IsNew
            };
        }
    }
}