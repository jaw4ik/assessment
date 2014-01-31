using System.Web.Optimization;

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
                    .Include("~/scripts/knockout-{version}.js")
                    .Include("~/scripts/knockout.validation.debug.js")
                    .Include("~/scripts/q.js")
                    .Include("~/scripts/underscore.js")
                    .Include("~/scripts/underscore.extensions.js")
                    .Include("~/scripts/ckeditor/ckeditor.js")
                    .Include("~/scripts/has.js")
                    .Include("~/scripts/moment.js")
                    .Include("~/scripts/moment-lang-nl.js", "~/scripts/moment-lang-de.js")
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
                );

            bundles.Add(new ScriptBundle("~/bundles/scripts/review")
                   .Include("~/scripts/jquery-{version}.js")
                   .Include("~/scripts/knockout-{version}.js")
                   .IncludeDirectory("~/scripts/review", "*.js")
                   .IncludeDirectory("~/scripts/common", "*.js")
                   .Include("~/scripts/underscore.js")
                   .Include("~/scripts/underscore.extensions.js")
                   .Include("~/scripts/knockoutBindings/slidingDialogBinding.js")
               );

            bundles.Add(new StyleBundle("~/Content/css")
                    .Include("~/Content/font-awesome.css")
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
                    .Include("~/Content/panels.css")
                );

            bundles.Add(new StyleBundle("~/Content/reviewcss")
                    .Include("~/Content/styles.css")
                    .Include("~/Content/common.css")
                    .Include("~/Content/review.css")
                );
        }
    }
}