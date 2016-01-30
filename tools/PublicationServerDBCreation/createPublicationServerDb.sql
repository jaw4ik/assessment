USE [master]
GO

CREATE DATABASE [easygenerator-publications] 
GO

USE [easygenerator-publications]
GO

CREATE TABLE [dbo].[Publications](
	[Id] [uniqueidentifier] NOT NULL,
	[OwnerEmail] [nvarchar](254) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[ModifiedOn] [datetime] NOT NULL,
	[PublicPath] [nvarchar](512) NOT NULL,
 CONSTRAINT [PK_Publications] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

CREATE TABLE [dbo].[Users](
	[Email] [nvarchar](254) NOT NULL,
	[AccessType] [int] NOT NULL,
	[ModifiedOn] [datetime] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT INTO [easygenerator-publications].[dbo].[Users] SELECT Email, AccessType, GETDATE() FROM [easygenerator-web].[dbo].[Users]






