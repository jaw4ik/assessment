namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CascadeDeleteExperience : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Experiences", "Template_Id", "dbo.Templates");
            DropForeignKey("dbo.ExperienceTemplateSettings", "Experience_Id", "dbo.Experiences");
            DropIndex("dbo.Experiences", new[] { "Template_Id" });
            DropIndex("dbo.ExperienceTemplateSettings", new[] { "Experience_Id" });
            CreateIndex("dbo.Experiences", "Template_Id");
            CreateIndex("dbo.ExperienceTemplateSettings", "Experience_Id");
            AddForeignKey("dbo.Experiences", "Template_Id", "dbo.Templates", "Id");
            AddForeignKey("dbo.ExperienceTemplateSettings", "Experience_Id", "dbo.Experiences", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ExperienceTemplateSettings", "Experience_Id", "dbo.Experiences");
            DropForeignKey("dbo.Experiences", "Template_Id", "dbo.Templates");
            DropIndex("dbo.ExperienceTemplateSettings", new[] { "Experience_Id" });
            DropIndex("dbo.Experiences", new[] { "Template_Id" });
            CreateIndex("dbo.ExperienceTemplateSettings", "Experience_Id");
            CreateIndex("dbo.Experiences", "Template_Id");
            AddForeignKey("dbo.ExperienceTemplateSettings", "Experience_Id", "dbo.Experiences", "Id");
            AddForeignKey("dbo.Experiences", "Template_Id", "dbo.Templates", "Id", cascadeDelete: true);
        }
    }
}
