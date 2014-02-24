namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RemoveFullNameAndAddFirstNameAndLastNameToTableUsers : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "FirstName", c => c.String(nullable: false));
            AddColumn("dbo.Users", "LastName", c => c.String(nullable: false));
            Sql(@"Update dbo.Users set FirstName = FullName");
            DropColumn("dbo.Users", "FullName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "FullName", c => c.String(nullable: false));
            DropColumn("dbo.Users", "LastName");
            DropColumn("dbo.Users", "FirstName");
        }
    }
}
