const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './upload-dir/')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({storage});
const path = require('path');

const app = express();
app.use(express.static('public'))

app.listen(80, () => {
    console.log('Server running')
});

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.post('/upload-binary', upload.single('file'), (req, res, next) => {
    let cmd = '"' + path.join(__dirname, '../', 'c_binary_reader', 'build', 'read_binary') + '" "' + path.join(__dirname, req.file.path) + '"';
    console.log(cmd);

    exec(cmd, (err, output) => {
        if(err) throw err;

        res.send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Where is my one?!</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&family=Space+Mono&display=swap');

      * {
          font-family: 'Roboto Mono', monospace;
      }

      body {
        height: 100vh;
        margin: 0;
        padding: 0;
      }

      body, .container {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #333333;
        color: blanchedalmond;
        flex-direction: column;
      }

      h1 {
        margin-top: 10px;
        margin-bottom: 40px;
      }

      .container {
        width: 800px;
        height: 200px;
        background-color: #222222;
        border-radius: 5px;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
      }

      span {
        background-color: #333333;
        border-radius: 5px;
        padding: 5px 15px;
        font-size: x-large;
      }
    </style>
  </head>
  <body>
      <div class="container">
        <div>
          <h1>First set bit appears at index:</h1>
        </div>
        <div>
          <span>${output == -1 ? 'No set bit was found!' : output}</span>
        </div>
      </div>
  </body>
</html>
        `);
    }); 
});
