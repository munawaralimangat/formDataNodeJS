const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000;
const url = "mongodb://127.0.0.1:27017/FormTest"

async function connectDB() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("database connected")
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
}

connectDB()

app.set('view engine','ejs')

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))

const formEntrySchema = new mongoose.Schema({
    name: String,
    email: String,
  });
  
  // Define the model with a custom collection name
  const FormEntry = mongoose.model('User', formEntrySchema, 'users');

  app.post('/submit',async (req,res)=>{
    try{
        const newEntry = new FormEntry({
            name:req.body.name,
            email:req.body.email,
        });
        await newEntry.save()
        res.redirect('display')
    }catch(error){
        console.log("Error serving data",error);
        res.status(500).send("Internal server error")
    }
  })

  app.get('/display',async (req,res)=>{
    try {
        const data = await FormEntry.find({})
        res.render('displayData',{data})
    } catch (error) {
        console.error('error fetching data from mongodb')
        res.status(500).send('internal server error')
    }
  })

app.listen(port,()=>{
    console.log("server running on port http://localhost:3000")
})