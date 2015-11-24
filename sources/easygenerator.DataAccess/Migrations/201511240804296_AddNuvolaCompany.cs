namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddNuvolaCompany : DbMigration
    {
        public override void Up()
        {
            Sql(@"
                      IF NOT EXISTS (SELECT * FROM Companies WHERE Name = 'Nuvola')
	                    INSERT INTO [dbo].[Companies] SELECT NEWID(), 'Nuvola', '/content/images/companies/nuvola.jpg', 'https://nuvolaacademy.com/api/external/publishcourse', 'e507ecd23d5c16a702788397e9dc67ae2651e315', 'i.muzika@easygenerator.com', GETDATE(), 'i.muzika@easygenerator.com', GETDATE(), 1
                      ELSE
	                    UPDATE [dbo].[Companies] SET PublishCourseApiUrl = 'https://nuvolaacademy.com/api/external/publishcourse', SecretKey = 'e507ecd23d5c16a702788397e9dc67ae2651e315' WHERE Name = 'Nuvola'
                ");
        }

        public override void Down()
        {
            Sql("DELETE FROM [dbo].[Companies] WHERE Name = 'Nuvola'");
        }
    }
}
