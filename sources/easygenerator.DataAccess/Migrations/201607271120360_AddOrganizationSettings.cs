namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddOrganizationSettings : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.OrganizationSettingsCollection",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        AccessType = c.Int(),
                        ExpirationDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Organizations", t => t.Id, cascadeDelete: true)
                .Index(t => t.Id);
            
            AddColumn("dbo.UserSettings", "PersonalAccessType", c => c.Int());
            AddColumn("dbo.UserSettings", "PersonalExpirationDate", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.OrganizationSettingsCollection", "Id", "dbo.Organizations");
            DropIndex("dbo.OrganizationSettingsCollection", new[] { "Id" });
            DropColumn("dbo.UserSettings", "PersonalExpirationDate");
            DropColumn("dbo.UserSettings", "PersonalAccessType");
            DropTable("dbo.OrganizationSettingsCollection");
        }
    }
}
