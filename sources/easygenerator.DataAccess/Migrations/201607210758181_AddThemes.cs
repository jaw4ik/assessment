namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddThemes : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Themes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(nullable: false, maxLength: 255),
                        Settings = c.String(),
                        CreatedBy = c.String(nullable: false, maxLength: 254),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false, maxLength: 254),
                        ModifiedOn = c.DateTime(nullable: false),
                        Template_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.Template_Id, cascadeDelete: true)
                .Index(t => t.Template_Id);
            
            AddColumn("dbo.CourseTemplateSettings", "Theme_Id", c => c.Guid());
            CreateIndex("dbo.CourseTemplateSettings", "Theme_Id");
            AddForeignKey("dbo.CourseTemplateSettings", "Theme_Id", "dbo.Themes", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CourseTemplateSettings", "Theme_Id", "dbo.Themes");
            DropForeignKey("dbo.Themes", "Template_Id", "dbo.Templates");
            DropIndex("dbo.Themes", new[] { "Template_Id" });
            DropIndex("dbo.CourseTemplateSettings", new[] { "Theme_Id" });
            DropColumn("dbo.CourseTemplateSettings", "Theme_Id");
            DropTable("dbo.Themes");
        }
    }
}
