const express = require('./node_modules/express');
const bodyParser = require('./node_modules/body-parser');
const app = express();
const upload = require('./middleware/file-upload');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./models');

// connect to db
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to the database!')
  })
  .catch(err => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  })
  
const audioBooks = db.audioBooks;

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Credentials", "true");
   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
 next();
});

app.post('/upload', upload.array('file', 1), (req, res) => {
  res.send({ file: req.file });
});

app.post('/create', (req, res) => {
  const audioBook = new audioBooks({
    title: req.body.title,
    reader: req.body.reader,
    image: req.body.image,
    audio: req.body.audio
  });
    
  audioBook.save()
    .then(data => {
      res.status(201).json({
        message: 'Post added successfully'
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the post."
      });
    });
});

app.get('/posts', (req, res) => {
  audioBooks.find()
    .then(data => {
      res.status(200).send({
        message: 'fetch data successfully', posts: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
})

app.get("/posts/:id", (req, res) => {
  audioBooks.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

app.delete("/posts/:id", (req, res) => {
  console.log('req.params.id', req.params.id);
  audioBooks.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

app.put("/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    reader: req.body.reader,
    image: req.body.image,
    audio: req.body.audio
  });
  audioBooks.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server RUNNING!');
});
