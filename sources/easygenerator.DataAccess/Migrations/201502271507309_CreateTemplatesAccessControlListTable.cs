namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateTemplatesAccessControlListTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TemplateAccessControlListEntries",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Template_Id = c.Guid(nullable: false),
                        UserIdentity = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Templates", t => t.Template_Id, cascadeDelete: true)
                .Index(t => t.Template_Id);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.TemplateAccessControlListEntries", "Template_Id", "dbo.Templates");
            DropIndex("dbo.TemplateAccessControlListEntries", new[] { "Template_Id" });
            DropTable("dbo.TemplateAccessControlListEntries");
        }
    }
}
