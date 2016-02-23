'use strict';

const constants = {
	packageFilesName: {
        model: 'model.xml', // info about course structure
        nodeDetails: 'NodeDetails.xml', //info about slide
        webControlInfoCollection: 'WebControlInfoCollection.xml', // info about question
        sanaFile: 'SanaFile.xml' // info about file
    },
	nodeTypes: {
		course: '0a44f9cc-1a91-4a5b-80ae-c742cead5010', // course
		chapter: '220c29e5-3865-4c35-9484-b24a4d45df4b', // objective
		page: 'c12c24a6-3166-44e6-8b18-52767247ed24', // question or information content
		questionsPool: '44d62917-c0fa-40a6-a476-c59921a1e05f'
	},
	webQuestionTypes: {
        MultipleSelect: 'multipleSelect',
        FillInTheBlanks: 'fillInTheBlank',
        DragAndDropText: 'dragAndDropText',
        SingleSelectText: 'singleSelectText',
        TextMatching: 'textMatching',
        SingleSelectImage: 'singleSelectImage',
        InformationContent: 'informationContent',
        HotSpot: 'hotspot',
        Statement: 'statement',
        OpenQuestion: 'openQuestion',
        Scenario: 'scenario'
    },
	pageTemplates: {
        BLANK: '8233468C-76DD-4773-868A-376D904D7A6D',
        FLASH: 'D814D4F3-971E-481E-96A0-18235DE90271',
        FLASHWITHTEXT: '48E31B74-EB37-40F5-9853-1B60138532E5',
        FLASHQUESTION: 'AC347C3B-104C-47F1-89C3-E93DAF8D6715',
        HOTSPOTQUESTION: '40E866A6-BAF5-43A5-B20A-C350950CD3AF',
        HOTSPOTQUESTIONHTML: '9B80ADF0-DC40-413C-A36F-F7963B678F7C',
        TEXT: '582BA8F3-E120-4FE7-A5B9-9C2CE3F478B5',
        IMAGE: 'CED0629F-1FE8-4596-8B5E-17471B8B2D91',
        IMAGEWITHTEXT: 'BA6911BC-09E2-4EED-8EF0-104D45319A1A',
        DRAGANDDROPQUESTION: 'D54BE38F-6F90-4C3D-A59C-03DE9C3EDF84',
        LIKERTQUESTION: 'AD7871CC-8E53-4E93-971D-CCF08D91BC1E',
        LIKERTQUESTIONHTML: '7FA796B3-43FE-4B03-A30F-A3135F48C322',
        MULTIPLECHOICEQUESTIONTEXT: '409FB6FE-8CC7-4FC3-9812-605AA82A5110',
        MULTIPLECHOICEQUESTIONTEXTHTML: '407AB9BF-5378-41A8-B169-6A4F7EFB2DEA',
        MULTIPLECHOICEQUESTIONIMAGE: 'FBDC3673-E6E8-4848-A36E-9F6EE7F765E7',
        RANKINGQUESTIONIMAGE: 'FA0FD4A2-BF76-4B3C-9496-A273D33C3E48',
        RANKINGQUESTIONTEXT: '19CF539F-34FD-4B91-BF9B-9E097C7F9110',
        STATEMENTQUESTIONHTML: 'AA76DEE0-42FD-4CE2-B44B-6BF0EA3CC136',
		STATEMENTQUESTION: 'F865D6A6-8FBE-448A-B2A6-1131A6291324',
        OPENQUESTION: '2CE093F4-7EB8-459B-AD56-1F4B81CA11FA',
        TEXTSMATCHINGQUESTION: 'E8D888BF-36B6-466A-B65E-A9EE42BFCFF3',
        TEXTSMATCHINGQUESTIONHTML: 'E6C9E340-F71A-4EC6-917A-B5F2DCA43BED',
        TEXTQUESTION: 'CB0971C0-3FCF-4626-B57F-CD43BD05029B',
        MEDIA: '17C55780-50AB-411F-9EEB-BDD3AEB61929',
        MEDIAWITHTEXT: '7AA64A29-4151-451E-9F65-E4D871C00FA8',
        FILLINTHEBLANKSQUESTION: '702C6956-8CB7-4F91-8FCE-9E786E700EEA'
    },
	filesType: [
		{
			id: '0dfc6d3c-2185-48b1-9d3c-4ea6acaf7cea',
			type: 'jpeg'
		}, {
			id: '9a4847b4-5197-48c3-987b-5a71bdcb0c6e',
			type: 'gif'
		}, {
			id: 'b93249ff-e932-4354-adfa-8b1ae0ea54ea',
			type: 'png'
		}, {
			id: 'a6b763c0-c7b9-4a3d-b05c-3a95035c4da1',
			type: 'bmp'
		}
	],
	slideTypes: {
        information: 'Information',
        question: 'Question'
    },
    supportedLearningContentControllerTypes: {
        image: 'ImageControlController',
        html: 'InlineHtmlControlController'
    },
    supportedQuestionControllerTypes: {
        openQuestion: 'SurveyTemplateControl',
        statement: 'StatementTemplateControl',
        statementHtml: 'StatementTemplateHtmlControlController',
        textMatching: 'TextMatchingTemplateControl',
        textMatchingHtml: 'TextsMatchingHtmlController',
        multipleChoice: 'MultipleChoiceTemplateControl',
        multipleChoiceHtml: 'MultipleChoiceHtmlController',
        singleChoiceImage: 'MultipleChoiceWithImagesTemplateController',
        hotspotHtml: 'HotspotHtmlController',
        hotspot: 'HotspotTemplateController',
        fib: 'FillInBlanksTemplateController'
    },
	maxHotspotSize: {
		width: 941,
		height: 785
	}
};

module.exports = constants;