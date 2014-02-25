namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ClearDefaultUserNameInUsersTable : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE dbo.Users
                  SET FirstName = ''
                  WHERE FirstName = 'easygenerator user'");
        }
        
        public override void Down()
        {
        }
    }
}
