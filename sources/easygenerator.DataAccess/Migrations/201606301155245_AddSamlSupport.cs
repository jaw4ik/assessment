namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSamlSupport : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SamlIdPUserInfoes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        SamlIdP_Id = c.Guid(nullable: false),
                        User_Id = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.SamlIdentityProviders", t => t.SamlIdP_Id, cascadeDelete: true)
                .ForeignKey("dbo.Users", t => t.User_Id, cascadeDelete: true)
                .Index(t => t.SamlIdP_Id)
                .Index(t => new { t.SamlIdP_Id, t.User_Id }, unique: true, name: "UI_SamlIdPUserInfo_SamlIdP_Id_User_Id")
                .Index(t => t.User_Id);
            
            CreateTable(
                "dbo.SamlIdentityProviders",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(nullable: false, maxLength: 255),
                        EntityId = c.String(nullable: false, maxLength: 511),
                        SingleSignOnServiceUrl = c.String(nullable: false, maxLength: 511),
                        SingleLogoutServiceUrl = c.String(maxLength: 511),
                        SingleSignOnServiceBinding = c.Short(nullable: false),
                        SingleLogoutServiceBinding = c.Short(),
                        AllowUnsolicitedAuthnResponse = c.Boolean(nullable: false),
                        MetadataLocation = c.String(maxLength: 511),
                        WantAuthnRequestsSigned = c.Boolean(nullable: false),
                        SigningCertificate = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.UserSettings", "IsCreatedThroughSamlIdP", c => c.Boolean(nullable: false));
            Sql("UPDATE UserSettings SET [IsCreatedThroughSamlIdP]=0");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SamlIdPUserInfoes", "User_Id", "dbo.Users");
            DropForeignKey("dbo.SamlIdPUserInfoes", "SamlIdP_Id", "dbo.SamlIdentityProviders");
            DropIndex("dbo.SamlIdPUserInfoes", new[] { "User_Id" });
            DropIndex("dbo.SamlIdPUserInfoes", "UI_SamlIdPUserInfo_SamlIdP_Id_User_Id");
            DropIndex("dbo.SamlIdPUserInfoes", new[] { "SamlIdP_Id" });
            DropColumn("dbo.UserSettings", "IsCreatedThroughSamlIdP");
            DropTable("dbo.SamlIdentityProviders");
            DropTable("dbo.SamlIdPUserInfoes");
        }
    }
}
