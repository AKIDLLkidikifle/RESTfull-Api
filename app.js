const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const wikischema = {
    title:String,
    content:String
};

const Article = mongoose.model("Article", wikischema);

const app = express();
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

/////////////////////////////////////////////request targetting all articles///////////////////////////////////////////////

app.route("/articles")

.get(function(req, res){    // get(read) all articles
    Article.find({}).then(function(err, data){
        if(!err){
            res.send(data);
        }
        else{
            res.send(err);
        }
    });
})

.post(function(req, res){  //post(create) one articles
    const article = new Article({
        title:req.body.title,
        content:req.body.content
    })

    article.save().then(function(err){
        if(!err){
            res.send("sucessfully added new article");
        }
        else{
            res.send(err);
        }
    });
})

.delete(function(req, res){ //delete all articles
    Article.deleteMany().then(function(err){
        if(!err){
            res.send("sucessfully deleted");
        }
        else{
            res.send(err);
        }
    });
});


///////////////////////////////////////////request targetting  a specific articles/////////////////////////////////////

app.route("/article/:parametername")
.get(function(req, res){
    Article.findOne({title:req.params.parametername}).then(function(data){
            res.send(data);
    });
 })

 .delete(function(req, res){
    Article.deleteOne({title:req.params.parametername}).then(function(info){
        res.send(info);
    });
 })

 .put(function(req, res){
    Article.updateOne({title:req.params.parametername}, {title:req.body.title, content:req.body.content}, {overwrite:true}).then(function(info){
        res.send(info);
    });
 })

 .patch(function(req, res){
    Article.updateOne({title:req.params.parametername},{$set:req.body}).then(function(info){
        res.send(info);
    });
 });

app.listen(3000, function(){
    console.log("server is running on port number 3000");
});