const express = require('express');
const app = express();
const cors = require('cors');
const videoRouter = require('./routes/videos');
const PORT = process.env.PORT ?? 8000;


app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());

app.use(express.static("public"));

app.use('/images', express.static(__dirname + '/images'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
    res.send('connected to server');
})

app.use('/videos', videoRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})




