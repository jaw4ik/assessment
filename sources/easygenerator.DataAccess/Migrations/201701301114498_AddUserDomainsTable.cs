namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserDomainsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.UserDomains",
                c => new
                    {
                        Domain = c.String(nullable: false, maxLength: 255),
                        NumberOfUsers = c.Int(nullable: false, defaultValue: 0),
                        Tracked = c.Boolean(nullable: false, defaultValue: false),
                    })
                .PrimaryKey(t => t.Domain);

            Sql(@"INSERT INTO UserDomains
                SELECT SUBSTRING(Email, CHARINDEX('@', Email) + 1, LEN(Email) - CHARINDEX('@', Email)) as Domain,
                COUNT(*) as NumberOfUsers, 1 from dbo.Users
                GROUP BY SUBSTRING(Email, CHARINDEX('@', Email) + 1, LEN(Email) - CHARINDEX('@', Email))");
        }
        
        public override void Down()
        {
            DropTable("dbo.UserDomains");
        }
    }
}
