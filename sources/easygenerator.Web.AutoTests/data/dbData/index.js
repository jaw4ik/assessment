module.exports = {
    users: {
        justCreated: {
            email: 'just@created.com',
            password: 'justcreated',
            firstName: 'Happy',
            lastName: 'Happiness'
        },
        trial: {
            email: 'trial@user.com',
            password: 'trialuser',
            firstName: 'Trial',
            lastName: 'User'
        },
        academy: {
            email: 'academy@user.com',
            password: 'academyuser',
            firstName: 'Academy',
            lastName: 'User'
        },
        notExisting: {
            email: 'not@exist.com',
            password: 'notexist',
            firstName: 'Not',
            lastName: 'Exist'
        }
    },
    courses: {
        trial: [{
                title: 'simple course with introduction'
            },{
                title: 'simple course with two sections and two questions per section',
                isPublished: true
            },{
                title: 'simple course with one section without questions'
            },{
                title: 'empty simple course'
        }]
    },
    videos: {
        academy: [{
            vimeoId: '202391821',
            title: 'football'
        }]
    }
}