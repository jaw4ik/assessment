namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSamlSupportAndIntegrationWithCoggno : DbMigration
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
            Sql("INSERT INTO SamlIdentityProviders VALUES('fe39c5c3-78e3-40df-b752-a9419f37d481', 'coggno', 'https://beta.coggno.com/easygenerator/idp/auth', 'https://beta.coggno.com/easygenerator/idp/auth', NULL, 1, NULL, 0, 'https://beta.coggno.com/easygenerator/idp/metadata', 0, 'MIID3zCCAsegAwIBAgIJAMpmZaD4ROtEMA0GCSqGSIb3DQEBCwUAMIGFMQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0ExETAPBgNVBAcMCFNhbiBKb3NlMRMwEQYDVQQKDApDb2dnbm8gSW5jMQ0wCwYDVQQLDARTQU1MMQ8wDQYDVQQDDAZDb2dnbm8xITAfBgkqhkiG9w0BCQEWEnN1cHBvcnRAY29nZ25vLmNvbTAeFw0xNjA2MTMxMjUxMjJaFw0yNjA2MTExMjUxMjJaMIGFMQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0ExETAPBgNVBAcMCFNhbiBKb3NlMRMwEQYDVQQKDApDb2dnbm8gSW5jMQ0wCwYDVQQLDARTQU1MMQ8wDQYDVQQDDAZDb2dnbm8xITAfBgkqhkiG9w0BCQEWEnN1cHBvcnRAY29nZ25vLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL5ozc+vSiKlGRBAE2uu85H4u8ftIrHKISvdc4d4J7vj8VojQGStBGHlaVGMGqR/7Tc3PFKJJy90A/RwtMVw9iBiATFcz27pACaWHPa80zoh3yEH3AZUU4nQ/WFr51KCisbp70PYfIUiL0zw8blNGh1KeGBRTPGcFZNk+KYyuGAYm4E+yrATYu4Y6krU8kvZfY78YSdu0xIMCKRYz9sXuynQXY9qKVv6DvjPNpNuADmBAJ8D2Fnefg6CAaC7fQmUwrg0lDWXgzf2P2KdwUdx0PNYYBeDlRIc2MaF7qaTwfyPSojaKPoCv8yefilHmUoL94SF7v94cU8Qq9UBA4svyHcCAwEAAaNQME4wHQYDVR0OBBYEFLcUQO/Zvmycp65zjf08bI6o1Az+MB8GA1UdIwQYMBaAFLcUQO/Zvmycp65zjf08bI6o1Az+MAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBADwiq6cZeTsiwHbZZjPuCtuNO0uwYesdUXThLVsTdAH6g7Xlx7LhC48XcvUq0iyi0/+WXWGdLSUeS/TsKFew/wVvBCPxcwp2WKkfIrLG37rzAoZTPc++yFKzT/TeM4U5SM9c94ptnYOmsTlbGFOPzNWN7UUFcGXsZfI+MlUwO3M4NQ7lokEC7WbQkXAVJzXv59XlJ/AqxJEVNoMb/yk3mIaXfwvJ5/v9TXPPzmioYUZ6asbdiP3HQ2fSB6t7/uU8ozV92k3qe/l3jqzwZPLv8pW1ZWtxGsecJIbc9B2/aXa6m6mrk0feUVPi6oPaviEFV7VezY5wWYIWssFMBH+f4A4=')");
            
            CreateTable(
                "dbo.CourseSaleInfoes",
                c => new
                    {
                        Course_Id = c.Guid(nullable: false),
                        PublishedOn = c.DateTime(),
                        DocumentId = c.String(maxLength: 255),
                        IsProcessing = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Course_Id)
                .ForeignKey("dbo.Courses", t => t.Course_Id, cascadeDelete: true)
                .Index(t => t.Course_Id);
            
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
            
            AddColumn("dbo.UserSettings", "IsCreatedThroughSamlIdP", c => c.Boolean(nullable: false));
            Sql("UPDATE UserSettings SET [IsCreatedThroughSamlIdP]=0");
            AddColumn("dbo.CourseStates", "IsDirtyForSale", c => c.Boolean(nullable: false));
            Sql("UPDATE CourseStates SET [IsDirtyForSale]=0");
            Sql("INSERT INTO CourseSaleInfoes (Course_Id, PublishedOn, DocumentId, IsProcessing) SELECT Id, NULL, NULL, 0 FROM Courses ");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CourseSaleInfoes", "Course_Id", "dbo.Courses");
            DropForeignKey("dbo.SamlIdPUserInfoes", "User_Id", "dbo.Users");
            DropForeignKey("dbo.SamlIdPUserInfoes", "SamlIdP_Id", "dbo.SamlIdentityProviders");
            DropForeignKey("dbo.UserSamlSPs", "User_Id", "dbo.Users");
            DropForeignKey("dbo.UserSamlSPs", "SamlServiceProvider_Id", "dbo.SamlServiceProviders");
            DropIndex("dbo.UserSamlSPs", new[] { "User_Id" });
            DropIndex("dbo.UserSamlSPs", new[] { "SamlServiceProvider_Id" });
            DropIndex("dbo.CourseSaleInfoes", new[] { "Course_Id" });
            DropIndex("dbo.SamlIdPUserInfoes", new[] { "User_Id" });
            DropIndex("dbo.SamlIdPUserInfoes", "UI_SamlIdPUserInfo_SamlIdP_Id_User_Id");
            DropIndex("dbo.SamlIdPUserInfoes", new[] { "SamlIdP_Id" });
            DropIndex("dbo.SamlServiceProviders", "IX_AscUrl");
            DropColumn("dbo.CourseStates", "IsDirtyForSale");
            DropColumn("dbo.UserSettings", "IsCreatedThroughSamlIdP");
            DropTable("dbo.UserSamlSPs");
            DropTable("dbo.CourseSaleInfoes");
            DropTable("dbo.SamlIdentityProviders");
            DropTable("dbo.SamlIdPUserInfoes");
            DropTable("dbo.SamlServiceProviders");
        }
    }
}
