const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require('crypto');
const { type } = require('os');

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
        const id = (req.params.id);
        const { name, comment } = req.body;
        const videoData = getVideos();
        const foundVideo = videoData.find(video => video.id === id);

        const newComment = {
            id: crypto.randomUUID(),
            name: name,
            comment: comment,
            likes: 0,
            timestamp: Date.now()
        };
        foundVideo.comments.push(newComment);
        setVideos(videoData);
        res.send(newComment);
    })

router
    .route("/:videoId/comments/:commentId")
    .delete((req,res) => {
        const videoId = req.params.videoId;
        const commentId = req.params.commentId;
        const videoData = getVideos();
        const foundVideo = videoData.find(video => video.id === videoId);
        if (foundVideo === -1) {
            return res.status(404).json({ error: "Video record not found" });
        }
        else{
            const foundComment= foundVideo.comments.findIndex(comment => comment.id === commentId)
            if (foundComment === -1) {
                return res.status(404).json({ error: "Comment not found" });
            }
            foundVideo.comments.splice(foundComment, 1);
        }
        setVideos(videoData);
        res.status(204).send();
    })

router
    .route("/:videoId/likes")
    .put((req,res) => {
        const videoId = req.params.videoId;
        
        const videoData = getVideos();
        const foundVideo = videoData.find(video => video.id === videoId);
        const like = parseFloat(foundVideo.likes.replace(/,/g, '')) +1 ;
        const strLike = like.toLocaleString('en-US');
        foundVideo.likes= strLike;
        setVideos(videoData); 

        res.send(strLike);
    })

module.exports = router;
