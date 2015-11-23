namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class AddICEMDCompany : DbMigration
    {
        public override void Up()
        {
            Sql(@"
                      IF NOT EXISTS (SELECT * FROM Companies WHERE Name = 'ICEMD')
	                    INSERT INTO [dbo].[Companies] SELECT NEWID(), 'ICEMD', '/content/images/companies/icemd.png', 'http://apiweb.icemd.com/PublishCourse', 'jkJLIJH98gt67HH7', 'v.ivanchuk@easygenerator.com', GETDATE(), 'v.ivanchuk@easygenerator.com', GETDATE()
                      ELSE
	                    UPDATE [dbo].[Companies] SET PublishCourseApiUrl = 'http://apiweb.icemd.com/PublishCourse', SecretKey = 'jkJLIJH98gt67HH7' WHERE Name = 'ICEMD'
                ");
        }

        public override void Down()
        {
            Sql("DELETE FROM [dbo].[Companies] WHERE Name = 'ICEMD'");
        }
    }
}
