const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require('crypto');

const json_file_path = './data/videos.json';

const getVideos = () => {
    const videosJson = fs.readFileSync(json_file_path);
    const videosData = JSON.parse(videosJson)
    return videosData;
}

const setVideos = (video) => {
    const videosJson = JSON.stringify(video)
    fs.writeFileSync(json_file_path, videosJson);
    console.log(json_file_path);
}

router
    .route("/")
    .get((req, res) => {
        const videoData = getVideos();
        const videoFilteredList = videoData.map((video) => ({
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image,
        }))
        res.send(videoFilteredList)
    })
    .post((req, res) => {
        console.log(req.body)
        const { title, description } = req.body;

        const videoData = getVideos();

        const newVideo = {
            id: crypto.randomUUID(),
            title: title,
            channel: "Reema Roy",
            image: './images/new-video.jpg',
            description: description,
            views: 0,
            likes: 0,
            duration: "45:59",
            video: "https://unit-3-project-api-0a5620414506.herokuapp.com/stream",
            timestamp: Date.now(),
            comments: []
        };
        videoData.push(newVideo);
        setVideos(videoData);
        res.send(newVideo);
    })

router
    .route("/:videoId")
    .get((req, res) => {
        const videoId = (req.params.videoId);

        const videoData = getVideos();

        const clickedVideoDetails = videoData.find((data) => {
            return data.id === videoId;
        })
        console.log(clickedVideoDetails)
        res.send(clickedVideoDetails)
    })

router
    .route("/:id/comments")
    .post((req, res) => {
        console.log(req.body)

        const id = (req.params.id);
        const { name, comment } = req.body;
        const videoData = getVideos();
        const video = videoData.find(video => video.id === id);

        const newComment = {
            id: crypto.randomUUID(),
            name: name,
            comment: comment,
            likes: 0,
            timestamp: Date.now()
        };
        video.comments.push(newComment);
        setVideos(videoData);
        res.send(newComment);
    })

module.exports = router;
