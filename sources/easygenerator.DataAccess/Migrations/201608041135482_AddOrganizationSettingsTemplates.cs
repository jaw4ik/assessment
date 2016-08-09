namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddOrganizationSettingsTemplates : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.OrganizationSettingsTemplates",
                c => new
                    {
                        OrganizationSettings_Id = c.Guid(nullable: false),
                        Template_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.OrganizationSettings_Id, t.Template_Id })
                .ForeignKey("dbo.OrganizationSettings", t => t.OrganizationSettings_Id, cascadeDelete: true)
                .ForeignKey("dbo.Templates", t => t.Template_Id, cascadeDelete: true)
                .Index(t => t.OrganizationSettings_Id)
                .Index(t => t.Template_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.OrganizationSettingsTemplates", "Template_Id", "dbo.Templates");
            DropForeignKey("dbo.OrganizationSettingsTemplates", "OrganizationSettings_Id", "dbo.OrganizationSettings");
            DropIndex("dbo.OrganizationSettingsTemplates", new[] { "Template_Id" });
            DropIndex("dbo.OrganizationSettingsTemplates", new[] { "OrganizationSettings_Id" });
            DropTable("dbo.OrganizationSettingsTemplates");
        }
    }
}
