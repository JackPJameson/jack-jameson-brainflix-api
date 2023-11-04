const express = require('express');
const router = express.Router();
const fs = require('fs');
const videosPath = './data/videos.json';
const videoDetailsPath = './data/videoDetails.json';




// Functions to read the JSON files and post JSON files and converting using strinigify or parse
const readVideos = () => {
    const videoData = JSON.parse(fs.readFileSync(videosPath));
    return videoData;
}

const writeVideoDetails = (videos) => {
    fs.writeFileSync("./data/videoDetails.json", JSON.stringify(videos));
};

const writeVideos = (videos) => {
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
};

const readVideoDetails = () => {
    try {
        const videoDetailData = JSON.parse(fs.readFileSync(videoDetailsPath));
        console.log("Successfully read videoDetailsData:", videoDetailData);
        return videoDetailData;
    } catch (error) {
        console.error("Error reading videoDetailsData:", error);
        return [];
    }
}


// Server middleware functions
router.param('id', (req, res, next, id) => {
    const videos = readVideoDetails();
    const foundVideo = videos.find((video) => video.id === id);

    if (foundVideo) {
        req.video = foundVideo;
        next();
    } else {
        res.status(404).send("Couldn't find video with id: " + id);
    }
});

router.param('id', (req, res, next, id) => {
    const videos = readVideos();
    const foundVideo = videos.find((video) => video.id === id);

    if (foundVideo) {
        req.video = foundVideo;
        next();
    } else {
        res.status(404).send("Couldn't find video with id: " + id);
    }
});


// routes for fetching required data from the right JSON file
router
    .route('/')
    .get((req, res) => {
        console.log(req.query);
        const videos = readVideos();
        res.json(videos);
    })
    .post((req, res) => {
        const formData = req.body;
        const newVideo = {
          id: JSON.stringify(Math.floor(Math.random() * 100000)),
          title: formData.title,
          channel: 'Jack Jameson',
          image: 'https://i.imgur.com/l2Xfgpl.jpg',
          description: formData.description,
          timestamp: new Date().getTime(),
          views: 0,
          likes: 0,
          comments: [],
        };

        const videoDetailsData = readVideoDetails();
        videoDetailsData.push(newVideo);
        writeVideoDetails(videoDetailsData);

        const videosData = readVideos();
        videosData.push(newVideo);
        writeVideos(videosData);

        res.status(201).json(newVideo);
    });

    router
    .route('/:id')
    .get((req, res) => {
      const videoDetailsData = readVideoDetails();
      const { id } = req.params;
      
      const foundVideo = videoDetailsData.find((video) => video.id === id);
  
      if (foundVideo) {
        res.json(foundVideo);
      } else {
        res.status(404).send("Couldn't find video details with id: " + id);
      }
    });


module.exports = router 