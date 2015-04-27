namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveIntroductionPage : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.UserSettings", "Id", "dbo.Users");
            DropIndex("dbo.UserSettings", new[] { "Id" });
            DropTable("dbo.UserSettings");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.UserSettings",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        IsShowIntroductionPage = c.Boolean(nullable: false),
                        CreatedBy = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateIndex("dbo.UserSettings", "Id");
            AddForeignKey("dbo.UserSettings", "Id", "dbo.Users", "Id");
        }
    }
}
