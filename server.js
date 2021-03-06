const express=require('express')
const mongoose=require ('mongoose')

const users=require('./routes/api/users')
const profile=require('./routes/api/profile')
const posts=require('./routes/api/posts')
const bodyParser=require('body-parser')
const passport=require('passport')

const app=express();
//Body Parser middelware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const db=require('./config/keys').mongoURI;

//Connect to mongodb
mongoose.connect(db, { useUnifiedTopology: true ,useNewUrlParser: true})
.then(()=>console.log('MongoDb Connected'))
.catch(err=>console.log(err))
// app.get('/',(req,res) =>{ res.send('Hello')})

//Passport middlewarre
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport)
app.use('/api/users',users)
app.use('/api/profile',profile)
app.use('/api/posts',posts)

const port = 5000 || process.env.PORT
app.listen(port,()=>console.log(`Server running on port ${port}`))