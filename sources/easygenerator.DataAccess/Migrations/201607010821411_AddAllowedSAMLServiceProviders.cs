namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAllowedSAMLServiceProviders : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SamlServiceProviders",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        AssertionConsumerServiceUrl = c.String(nullable: false, maxLength: 511),
                        Issuer = c.String(nullable: false, maxLength: 511),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.AssertionConsumerServiceUrl, unique: true, name: "IX_AscUrl");
            
            CreateTable(
                "dbo.UserSamlSPs",
                c => new
                    {
                        SamlServiceProvider_Id = c.Guid(nullable: false),
                        User_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => new { t.SamlServiceProvider_Id, t.User_Id })
                .ForeignKey("dbo.SamlServiceProviders", t => t.SamlServiceProvider_Id, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.SamlServiceProvider_Id)
                .Index(t => t.User_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserSamlSPs", "User_Id", "dbo.Users");
            DropForeignKey("dbo.UserSamlSPs", "SamlServiceProvider_Id", "dbo.SamlServiceProviders");
            DropIndex("dbo.UserSamlSPs", new[] { "User_Id" });
            DropIndex("dbo.UserSamlSPs", new[] { "SamlServiceProvider_Id" });
            DropIndex("dbo.SamlServiceProviders", "IX_AscUrl");
            DropTable("dbo.UserSamlSPs");
            DropTable("dbo.SamlServiceProviders");
        }
    }
}
