using easygenerator.DomainModel.Entities;
using easygenerator.Web.Extensions;

namespace easygenerator.Web.Components.Mappers
{
    public class TemplateMapper : EntityModelMapper<Template>
    {
        private readonly ManifestFileManager _manifestFileManager;

        public TemplateMapper(ManifestFileManager manifestFileManager)
        {
            _manifestFileManager = manifestFileManager;
        }

        public override dynamic Map(Template template)
        {
            var manifest = _manifestFileManager.ReadManifest(template);
            if (manifest == null)
            {
                return null;
            }

            return new
            {
                Id = template.Id.ToNString(),
                Manifest = manifest,
                TemplateUrl = "templates/" + template.Name + "/",
                PreviewDemoUrl = template.PreviewUrl,
                Order = template.Order,
                IsCustom = template.IsCustom,
                IsNew = template.IsNew,
                IsDeprecated = template.IsDeprecated
            };
        }
    }
}