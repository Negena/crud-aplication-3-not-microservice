const express     = require("express");
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
const ejs         = require("ejs");
const app  = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://user1:useronce@cluster0.txaa5.mongodb.net/getData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, function(err){
  if (err) throw err ;
  else console.log('db connected');
});

const UsersSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  age: Number,
  about: String,
  number: Number
});

let User = mongoose.model('User', UsersSchema);


app.get("/", (req,res) => {
  res.sendFile("index.html", {root: __dirname});
});

app.post('/', (req,res) => {
   const newUser = new User({
     _id : new mongoose.Types.ObjectId(),
     name: req.body.name,
     age: req.body.age,
     about: req.body.about,
     number: req.body.number
   });
   newUser.save()
   res.render("send.ejs", {data: newUser});
});

app.get("/all", (req,res) => {
  const allUsers = User.find({}, function(err, data){
    if (err) throw err;
    else
    res.render("all.ejs", {
      data: data
    });
  });
});

app.get("/:name", (req,res) => {
  const name = req.params.name;
  User.find({"name": name}, function(err, data){
    if (err) throw err;
    else
    res.send(data);
  });
});

// =============== //
app.get("/:id", (req,res) => {
  User.findById(req.params.id, function(err, data){
    if (err) throw err;
    else
    res.send(data);
  });
})

app.get("/user/:id", (req,res) => {
  let id = req.params.id;
   User.findById(req.params.id, function(err, data){
     if (err) throw err ;
     else
     res.render("user.ejs", {data: data});
   });
});

app.use( function( req, res, next ) {
    if ( req.query._method == 'DELETE' ) {
        req.method = 'DELETE';
        req.url = req.path;
    }
    next();
});

app.delete("/del/:id", (req,res) => {
  let id = req.params.id;
  User.findByIdAndRemove(id, function(err){
    if (err) throw err ;
    else
    res.redirect("/all");
  });
});

app.get("/edit/:id", (req,res) => {
  let id = req.params.id;
   User.findById(req.params.id, function(err, data){
     if (err) throw err ;
     else
     res.render("edit.ejs", {data: data});
   });
});

app.post("/edit/:id", (req,res) => {
  const data = {};
  data.name = req.body.name,
  data.age = req.body.age,
  data.about = req.body.about,
  data.number = req.body.number

  let query = {_id: req.params.id};
  User.findOneAndUpdate(query, data, function(err){
    if (err) throw err;
    else
    res.redirect("/all")
  })
})

app.listen(3000, () => {
  console.log("works....")
});
