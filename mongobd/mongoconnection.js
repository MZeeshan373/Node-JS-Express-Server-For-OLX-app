var mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://Zeeshan373:Zeeshan373@reactapp-ktdei.mongodb.net/test?retryWrites=true', { dbName: 'olx', useNewUrlParser:true });
mongoose.connect('mongodb://myolx:olx123@ds125526.mlab.com:25526/olx', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function () { console.log('Successfully connected to DB') });