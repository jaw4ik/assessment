namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserSettingsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserSettings",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        IsShowIntroductionPage = c.Boolean(nullable: false, defaultValue: true),
                        CreatedBy = c.String(nullable: false),
                        CreatedOn = c.DateTime(nullable: false),
                        ModifiedBy = c.String(nullable: false),
                        ModifiedOn = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Id, cascadeDelete: true)
                .Index(t => t.Id);

            Sql("INSERT INTO dbo.UserSettings (Id, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn)" +
                            " SELECT Id, CreatedBy, CURRENT_TIMESTAMP AS CreatedOn, ModifiedBy,CURRENT_TIMESTAMP AS ModifiedOn FROM dbo.Users");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserSettings", "Id", "dbo.Users");
            DropIndex("dbo.UserSettings", new[] { "Id" });
            DropTable("dbo.UserSettings");
        }
    }
}
