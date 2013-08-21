using System.Web.Optimization;

namespace easygenerator.Web.Configuration
{
    public static class BundleConfiguration
    {
        public static void Configure()
        {
            var bundles = BundleTable.Bundles;
            bundles.IgnoreList.Clear();

            bundles.IgnoreList.Ignore("~/scripts/jquery.autosize.js", OptimizationMode.WhenDisabled);

            bundles.Add(new ScriptBundle("~/scripts/modernizr")
                 .Include("~/scripts/modernizr-{version}.js"));

            bundles.Add(new ScriptBundle("~/scripts/vendor")
                    .Include("~/scripts/jquery-{version}.js")
                    .Include("~/scripts/knockout-{version}.js")
                    .Include("~/scripts/knockout.validation.debug.js")
                    .Include("~/scripts/sammy-{version}.js")
                    .Include("~/scripts/q.js")
                    .Include("~/scripts/underscore.js")
                    .Include("~/scripts/underscore.extensions.js")
                    .Include("~/scripts/ckeditor/ckeditor.js")
                    .Include("~/scripts/jquery.autosize.js")
                    .IncludeDirectory("~/scripts/knockoutBindings", "*Binding.js")
                );

            bundles.Add(new StyleBundle("~/Content/css")
                    .Include("~/Content/font-awesome.css")
                    .Include("~/Content/durandal.css")
                    .Include("~/Content/styles.css")
                    .Include("~/Content/question.css")
                    .Include("~/Content/objective.css")
                    .Include("~/Content/objectives.css")
                    .Include("~/Content/experiences.css")
                    .Include("~/Content/common.css")
                    .Include("~/Content/experience.css")
                    .Include("~/Scripts/ckeditor/Content.css")
                    .Include("~/Content/ckeditor.css")
                );
        }
    }
}