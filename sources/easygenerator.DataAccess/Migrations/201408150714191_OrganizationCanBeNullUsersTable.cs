namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class OrganizationCanBeNullUsersTable : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Users", "Organization", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Users", "Organization", c => c.String(nullable: false));
        }
    }
}
