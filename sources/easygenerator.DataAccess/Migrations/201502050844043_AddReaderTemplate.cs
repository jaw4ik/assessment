namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class AddReaderTemplate : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO dbo.Templates VALUES(NEWID(), 'Reader', '/Templates/Reader/', 'admin@easygenerator.com', GETDATE(), 'admin@easygenerator.com', GETDATE(), 5, 1)");
        }
        
        public override void Down()
        {
            Sql("DELETE FROM Templates WHERE Name = 'Reader'");
        }
    }
}
