namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CreateLtiUserInfoesTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.LtiUserInfoes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        LtiUserId = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Id, cascadeDelete: true)
                .Index(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.LtiUserInfoes", "Id", "dbo.Users");
            DropIndex("dbo.LtiUserInfoes", new[] { "Id" });
            DropTable("dbo.LtiUserInfoes");
        }
    }
}
