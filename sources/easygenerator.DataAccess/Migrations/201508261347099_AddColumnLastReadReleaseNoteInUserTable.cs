namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddColumnLastReadReleaseNoteInUserTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "LastReadReleaseNote", c => c.String(maxLength: 25));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "LastReadReleaseNote");
        }
    }
}
