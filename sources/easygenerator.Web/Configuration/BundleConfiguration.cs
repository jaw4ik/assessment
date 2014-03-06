using System.Web.Optimization;
using easygenerator.Web.Components.BundleTransforms;

namespace easygenerator.Web.Configuration
{
    public static class BundleConfiguration
    {
        public static void Configure()
        {
            var bundles = BundleTable.Bundles;
            bundles.IgnoreList.Clear();
            bundles.IgnoreList.Ignore("*.spec.js");

            bundles.Add(new ScriptBundle("~/scripts/vendor")
                    .Include("~/scripts/jquery-{version}.js")
                    .Include("~/scripts/jquery-ui-{version}.custom.js")
                    .Include("~/scripts/knockout-{version}.js")
                    .Include("~/scripts/knockout.validation.debug.js")
                    .Include("~/scripts/knockout-sortable.js")
                    .Include("~/scripts/q.js")
                    .Include("~/scripts/underscore.js")
                    .Include("~/scripts/underscore.extensions.js")
                    .Include("~/scripts/ckeditor/ckeditor.js")
                    .Include("~/scripts/has.js")
                    .Include("~/scripts/moment.js")
                    .Include("~/scripts/jquery.placeholder.js")
                    .IncludeDirectory("~/scripts/knockoutBindings", "*Binding.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/scripts/account")
                    .Include("~/scripts/jquery-{version}.js")
                    .Include("~/scripts/knockout-{version}.js")
                    .IncludeDirectory("~/scripts/account", "*.js")
                    .IncludeDirectory("~/scripts/common", "*.js")
                    .Include("~/scripts/underscore.js")
                    .Include("~/scripts/underscore.extensions.js")
                    .Include("~/scripts/knockoutBindings/selectBoxBinding.js")
                    .Include("~/scripts/jquery.placeholder.js")
                    .Include("~/scripts/knockoutBindings/placeholderBinding.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/scripts/review")
                   .Include("~/scripts/jquery-{version}.js")
                   .Include("~/scripts/knockout-{version}.js")
                   .IncludeDirectory("~/scripts/review", "*.js")
                   .IncludeDirectory("~/scripts/common", "*.js")
                   .Include("~/scripts/underscore.js")
                   .Include("~/scripts/underscore.extensions.js")
                   .Include("~/scripts/jquery.placeholder.js")
                   .Include("~/scripts/knockoutBindings/slidingDialogBinding.js")
                   .Include("~/scripts/knockoutBindings/placeholderBinding.js")
               );


            var stylesBundle = new StyleBundle("~/Content/css")
                .Include("~/Content/durandal.css")
                .Include("~/Content/common_old.css")
                .Include("~/Content/styles.css")
                .Include("~/Content/question.css")
                .Include("~/Content/objective.css")
                .Include("~/Content/objectives.css")
                .Include("~/Content/courses.css")
                .Include("~/Content/course.css")
                .Include("~/Scripts/ckeditor/Content.css")
                .Include("~/Content/ckeditor.css")
                .Include("~/Content/notify.css")
                .Include("~/Content/selectbox.css")
                .Include("~/Content/common.css")
                .Include("~/Content/account.css")
                .Include("~/Content/helphint.css")
                .Include("~/Content/introduction.css")
                .Include("~/Content/treeOfContent.css")
                .Include("~/Content/panels.css");
            stylesBundle.Transforms.Add(new ImageNoCacheParamTransform());
            bundles.Add(stylesBundle);

            bundles.Add(new StyleBundle("~/Content/reviewcss")
                    .Include("~/Content/styles.css")
                    .Include("~/Content/common.css")
                    .Include("~/Content/review.css")
                );
        }
    }
}