namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddExperienceTemplateSettingsTable : DbMigration
    {
        public override void Up()
        {
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
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.Template_Id, cascadeDelete: true)
                .ForeignKey("dbo.Experiences", t => t.Experience_Id)
                .Index(t => t.Template_Id)
                .Index(t => t.Experience_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ExperienceTemplateSettings", "Experience_Id", "dbo.Experiences");
            DropForeignKey("dbo.ExperienceTemplateSettings", "Template_Id", "dbo.Templates");
            DropIndex("dbo.ExperienceTemplateSettings", new[] { "Experience_Id" });
            DropIndex("dbo.ExperienceTemplateSettings", new[] { "Template_Id" });
            DropTable("dbo.ExperienceTemplateSettings");
        }
    }
}
