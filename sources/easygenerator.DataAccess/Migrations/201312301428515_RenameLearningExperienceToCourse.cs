namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class RenameLearningExperienceToCourse : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.ExperienceObjectives", "Experience_Id", "dbo.Experiences");
            DropForeignKey("dbo.ExperienceObjectives", "Objective_Id", "dbo.Objectives");
            DropForeignKey("dbo.Experiences", "Template_Id", "dbo.Templates");
            DropForeignKey("dbo.ExperienceTemplateSettings", "Template_Id", "dbo.Templates");
            DropForeignKey("dbo.ExperienceTemplateSettings", "Experience_Id", "dbo.Experiences");
            DropIndex("dbo.ExperienceObjectives", new[] { "Experience_Id" });
            DropIndex("dbo.ExperienceObjectives", new[] { "Objective_Id" });
            DropIndex("dbo.Experiences", new[] { "Template_Id" });
            DropIndex("dbo.ExperienceTemplateSettings", new[] { "Template_Id" });
            DropIndex("dbo.ExperienceTemplateSettings", new[] { "Experience_Id" });
            CreateTable(
                "dbo.Courses",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Title = c.String(nullable: false, maxLength: 255),
                    BuildOn = c.DateTime(),
                    PackageUrl = c.String(),
                    PublishedOn = c.DateTime(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Template_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.Template_Id)
                .Index(t => t.Template_Id);

            Sql("INSERT INTO dbo.Courses (Id, Title, BuildOn, PackageUrl, PublishedOn, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, Template_Id)" +
                           " SELECT Id, Title, BuildOn, PackageUrl, PublishedOn, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, Template_Id FROM dbo.Experiences");

            CreateTable(
                "dbo.CourseTemplateSettings",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Settings = c.String(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Template_Id = c.Guid(nullable: false),
                    Course_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.Template_Id, cascadeDelete: true)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Template_Id)
                .Index(t => t.Course_Id);

            Sql("INSERT INTO dbo.CourseTemplateSettings (Id, Settings, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, Template_Id, Course_Id)" +
                           " SELECT Id, Settings, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn, Template_Id, Experience_Id AS Course_Id FROM dbo.ExperienceTemplateSettings");

            CreateTable(
                "dbo.CourseObjectives",
                c => new
                {
                    Course_Id = c.Guid(nullable: false),
                    Objective_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => new { t.Course_Id, t.Objective_Id })
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .ForeignKey("dbo.Objectives", t => t.Objective_Id, cascadeDelete: true)
                .Index(t => t.Course_Id)
                .Index(t => t.Objective_Id);

            Sql("INSERT INTO dbo.CourseObjectives (Course_Id, Objective_Id)" +
                           " SELECT Experience_Id AS Course_Id, Objective_Id FROM dbo.ExperienceObjectives");

            DropTable("dbo.Experiences");
            DropTable("dbo.ExperienceTemplateSettings");
            DropTable("dbo.ExperienceObjectives");
        }

        public override void Down()
        {
            CreateTable(
                "dbo.ExperienceObjectives",
                c => new
                {
                    Experience_Id = c.Guid(nullable: false),
                    Objective_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => new { t.Experience_Id, t.Objective_Id });

            CreateTable(
                "dbo.ExperienceTemplateSettings",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Settings = c.String(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Template_Id = c.Guid(nullable: false),
                    Experience_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            CreateTable(
                "dbo.Experiences",
                c => new
                {
                    Id = c.Guid(nullable: false),
                    Title = c.String(nullable: false, maxLength: 255),
                    BuildOn = c.DateTime(),
                    PackageUrl = c.String(),
                    PublishedOn = c.DateTime(),
                    CreatedBy = c.String(nullable: false),
                    CreatedOn = c.DateTime(nullable: false),
                    ModifiedBy = c.String(nullable: false),
                    ModifiedOn = c.DateTime(nullable: false),
                    Template_Id = c.Guid(nullable: false),
                })
                .PrimaryKey(t => t.Id);

            DropForeignKey("dbo.CourseTemplateSettings", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.CourseTemplateSettings", "Template_Id", "dbo.Templates");
            DropForeignKey("dbo.Courses", "Template_Id", "dbo.Templates");
            DropForeignKey("dbo.CourseObjectives", "Objective_Id", "dbo.Objectives");
            DropForeignKey("dbo.CourseObjectives", "Course_Id", "dbo.Courses");
            DropIndex("dbo.CourseTemplateSettings", new[] { "Course_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Template_Id" });
            DropIndex("dbo.Courses", new[] { "Template_Id" });
            DropIndex("dbo.CourseObjectives", new[] { "Objective_Id" });
            DropIndex("dbo.CourseObjectives", new[] { "Course_Id" });
            DropTable("dbo.CourseObjectives");
            DropTable("dbo.CourseTemplateSettings");
            DropTable("dbo.Courses");
            CreateIndex("dbo.ExperienceTemplateSettings", "Experience_Id");
            CreateIndex("dbo.ExperienceTemplateSettings", "Template_Id");
            CreateIndex("dbo.Experiences", "Template_Id");
            CreateIndex("dbo.ExperienceObjectives", "Objective_Id");
            CreateIndex("dbo.ExperienceObjectives", "Experience_Id");
            AddForeignKey("dbo.ExperienceTemplateSettings", "Experience_Id", "dbo.Experiences", "Id", cascadeDelete: true);
            AddForeignKey("dbo.ExperienceTemplateSettings", "Template_Id", "dbo.Templates", "Id", cascadeDelete: true);
            AddForeignKey("dbo.Experiences", "Template_Id", "dbo.Templates", "Id");
            AddForeignKey("dbo.ExperienceObjectives", "Objective_Id", "dbo.Objectives", "Id", cascadeDelete: true);
            AddForeignKey("dbo.ExperienceObjectives", "Experience_Id", "dbo.Experiences", "Id", cascadeDelete: true);
        }
    }
}
