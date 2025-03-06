const express=require('express');
const app=express();
const PORT=8001;
const urlRoute=require('./routes/url');
const{connectToMongoDB}=require('./connect');
const URL=require('./models/url'); 
const path=require('path');
const staticRoute=require('./routes/staticRouter');

connectToMongoDB('mongodb://127.0.0.1:27017/Database')
.then(()=>{
    console.log('mongodb connected successfully!');
})

//To use ejs files the below are setted and the path module is required.
app.set('view engine','ejs');//it tells the view engine used is ejs
app.set('views',path.resolve('./views'));//it tells the express about the location of ejs files.


app.use(express.json());
app.use(express.urlencoded({extended:false}));
//short id/ nano id package is used in this project which is a package that generates short id.
app.use('/',urlRoute);

app.use('/',staticRoute);

//for only test purpose not in project
app.get('/test',async(req,res)=>{
    const allUrls=await URL.find({});
    return res.render('home',{
        urls:allUrls,
    });//we can also pass variables in render by making an object
});
//There are some templating engines which helps you render html.
//ejs is used which is embedded javascript engine.
//pug js and handle js are similar.

app.get('/:shortId',async(req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory:{
                timestamp:Date.now(),
            }
        },
    });
    res.redirect(entry.redirectURL);
});

app.listen(PORT,()=>{
    console.log("Server started at port",PORT);
});