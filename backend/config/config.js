// dbPassword = 'mongodb+srv://user:<password>@cluster0.1vxr7.mongodb.net/<database>?retryWrites=true&w=majority'
productionDB = 'mongodb+srv://SW_ARC_TEAM_2:SW_ARC_TEAM_2@busdb.3y5bt.mongodb.net/BusDB?retryWrites=true&w=majority'
testDB = 'mongodb+srv://arch_project:arch_project@cluster0.tw7vx.mongodb.net/testsdb?retryWrites=true&w=majority'
GOOGLE_CLIENT_ID = '40618463654-6eia2o6us07rtmal20a0c64j220ccjav.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = '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'
GOOGLE_CALLBACK = 'http://localhost:5000/auth/google/callback'

module.exports = {
    'secret': '<password>',
    mongodb: productionDB,
    testdb: testDB,
    GOOGLE_CLIENT_ID,
    GOOGLE_CALLBACK,
    GOOGLE_CLIENT_SECRET
}