namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddOrganizationSettings : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.OrganizationSettings",
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
            DropForeignKey("dbo.OrganizationSettings", "Id", "dbo.Organizations");
            DropIndex("dbo.OrganizationSettings", new[] { "Id" });
            DropColumn("dbo.UserSettings", "PersonalExpirationDate");
            DropColumn("dbo.UserSettings", "PersonalAccessType");
            DropTable("dbo.OrganizationSettings");
        }
    }
}
