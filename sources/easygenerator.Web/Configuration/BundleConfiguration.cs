using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace easygenerator.Web.Configuration
{
    public static class BundleConfiguration
    {
        public static void Configure()
        {
            var bundles = BundleTable.Bundles;

            bundles.Add(new ScriptBundle("~/scripts/modernizr")
                            .Include("~/scripts/modernizr-{version}.js"));

            bundles.Add(new ScriptBundle("~/scripts/vendor")
                            .Include("~/scripts/jquery-{version}.js")
                            .Include("~/scripts/respond.js")
                            .Include("~/scripts/knockout-{version}.js")
                            .Include("~/scripts/knockout.validation.js")
                            .Include("~/scripts/sammy-{version}.js")
                            .Include("~/scripts/q.js")
                            .Include("~/scripts/underscore.js"));

            bundles.Add(new StyleBundle("~/Content/css")
                            .Include("~/Content/font-awesome.css")
                            .Include("~/Content/durandal.css")
                            .Include("~/Content/common.css")
                            .Include("~/Content/styles.css")
                            .Include("~/Content/question.css")
                            .Include("~/Content/objective.css")
                            .Include("~/Content/objectives.css"));

        }
    }
}