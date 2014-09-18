﻿using easygenerator.Web.Components.BundleTransforms;
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
                    .Include("~/scripts/jquery-ui-{version}.custom.js")
                    .Include("~/scripts/jquery.signalR-{version}.js")
                    .Include("~/scripts/knockout-{version}.js")
                    .Include("~/scripts/knockout.validation.js")
                    .Include("~/scripts/knockout-sortable.js")
                    .Include("~/scripts/q.js")
                    .Include("~/scripts/underscore.js")
                    .Include("~/scripts/underscore.extensions.js")
                    .Include("~/scripts/has.js")
                    .Include("~/scripts/moment.js")
                    .Include("~/scripts/jquery.form.js")
                    .Include("~/scripts/jquery.extensions.js")
                    .Include("~/scripts/jquery.autosize.js")
                    .IncludeDirectory("~/scripts/knockoutBindings", "*Binding.js")
                );

            //CKEditor.js doesn't pass javascript validation, because of that it can't be minified in vendor bundle
            //so we used already minified version in separate bundle
            bundles.Add(new Bundle("~/scripts/ckeditor.min").Include("~/scripts/ckeditor/ckeditor.js"));

            bundles.Add(new ScriptBundle("~/bundles/scripts/account")
                    .Include("~/scripts/jquery-{version}.js")
                    .Include("~/scripts/knockout-{version}.js")
                    .IncludeDirectory("~/scripts/account", "*.js")
                    .IncludeDirectory("~/scripts/common", "*.js")
                    .Include("~/scripts/underscore.js")
                    .Include("~/scripts/underscore.extensions.js")
                    .Include("~/scripts/knockoutBindings/selectBoxBinding.js")
                    .Include("~/scripts/knockoutBindings/placeholderBinding.js")
                );

            bundles.Add(new ScriptBundle("~/bundles/scripts/review")
                   .Include("~/scripts/jquery-{version}.js")
                   .Include("~/scripts/knockout-{version}.js")
                   .IncludeDirectory("~/scripts/review", "*.js")
                   .IncludeDirectory("~/scripts/common", "*.js")
                   .Include("~/scripts/underscore.js")
                   .Include("~/scripts/underscore.extensions.js")
                   .Include("~/scripts/knockoutBindings/slidingDialogBinding.js")
                   .Include("~/scripts/knockoutBindings/placeholderBinding.js")
               );

            var stylesBundle = new StyleBundle("~/Content/css")
                .Include("~/Content/durandal.css")
                .Include("~/Content/common.css")
                .Include("~/Content/styles.css")
                .Include("~/Content/question.css")
                .Include("~/Content/objective.css")
                .Include("~/Content/courses.css")
                .Include("~/Content/course.css")
                .Include("~/Content/collaboration.css")
                .Include("~/Scripts/ckeditor/Content.css")
                .Include("~/Content/ckeditor.css")
                .Include("~/Content/notify.css")
                .Include("~/Content/selectbox.css")
                .Include("~/Content/account.css")
                .Include("~/Content/helphint.css")
                .Include("~/Content/panels.css")
                .Include("~/Content/dragAndDropText.css")
                .Include("~/Content/imagePreview.css")
                .Include("~/Content/singleSelectImage.css")
                .Include("~/Content/cssPreloaders.css")
                .Include("~/Content/navigationBar.css")
                .Include("~/Content/treeOfContent.css")
                .Include("~/Content/onboarding.css");
            stylesBundle.Transforms.Add(new ImageNoCacheParamTransform());
            bundles.Add(stylesBundle);

            bundles.Add(new StyleBundle("~/Content/reviewcss")
                    .Include("~/Content/common.css")
                    .Include("~/Content/styles.css")
                    .Include("~/Content/review.css")
                );
        }
    }
}