namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddLoginInfo : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserLoginInfoes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Email = c.String(nullable: false, maxLength: 254),
                        FailedLoginAttemptsCount = c.Int(nullable: false),
                        LastFailTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Id, cascadeDelete: true)
                .Index(t => t.Id)
                .Index(t => t.Email, unique: true);
            
            CreateTable(
                "dbo.IPLoginInfoes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        IP = c.String(nullable: false, maxLength: 63),
                        FailedLoginAttemptsCount = c.Int(nullable: false),
                        LastFailTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.IP, unique: true);

            Sql("INSERT INTO UserLoginInfoes (Id, Email, FailedLoginAttemptsCount, LastFailTime) SELECT Id, Email, 0, NULL FROM Users ");

        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserLoginInfoes", "Id", "dbo.Users");
            DropIndex("dbo.IPLoginInfoes", new[] { "IP" });
            DropIndex("dbo.UserLoginInfoes", new[] { "Email" });
            DropIndex("dbo.UserLoginInfoes", new[] { "Id" });
            DropTable("dbo.IPLoginInfoes");
            DropTable("dbo.UserLoginInfoes");
        }
    }
}
