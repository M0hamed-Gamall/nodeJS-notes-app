const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');


app.use(express.static(path.join(__dirname,"statics")));
app.set('view engine' , 'ejs');
app.use(express.urlencoded({ extended: true }));


const { Schema, model } = mongoose;
const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});
const Note = model("Note", noteSchema)


app.get('/' , (req,res,next)=>{
    res.sendFile(path.join(__dirname ,  "form.html"));
})

app.post('/' , async(req,res,next)=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/myNotes');
        console.log("connected to mongodb successfully");
        // console.log(req.body);
        const note = new Note({
            title: req.body.title ,
            content: req.body.content,
          });
        const savedNote = await note.save();
        console.log("Note created:", savedNote);
    }catch(err){
        console.log("can't connect to databases : " , err)
    }finally{
        mongoose.disconnect();
        res.redirect('/');
    }
})

app.get('/allNotes' , async(req,res,next)=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/myNotes');
        console.log("connected to mongodb successfully");
        const notes = await Note.find();
        res.render('allNotes' , {notes});
    }catch(err){
        console.log("can't connect to databases : " , err)
    }finally{
        mongoose.disconnect();
    }
})


app.post('/delete/:id', async (req, res,next) => {
    const noteId = req.params.id;
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/myNotes');
        console.log("Connected to MongoDB successfully");
        
        
        const deletedNote = await Note.findByIdAndDelete(noteId);
        if (deletedNote) {
            console.log("Note deleted:", deletedNote);
        } else {
            console.log("No note found with that ID");
        }
    } catch (err) {
        console.log("Can't connect to database: ", err);
    } finally {
        mongoose.disconnect();
        res.redirect('/allNotes'); 
    }
});



app.listen(3000 , ()=>{
    console.log('app is listening on port 3000');
})