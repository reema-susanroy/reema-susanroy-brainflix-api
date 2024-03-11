const express = require('express');
const router = express.Router();
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

let videoId;
const json_file_path = './data/videos.json';

const getVideos = () => {
    const videosJson = fs.readFileSync(json_file_path);
    const videosData = JSON.parse(videosJson)
    return videosData;
}

const setVideos = (video) => {
    const videosJson = JSON.stringify(video)
    fs.writeFileSync(json_file_path, videosJson);
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads/');
    },
    filename: (req, file, callback) => {
        videoId = crypto.randomUUID();
        const extPath = path.extname(file.originalname);
        const newName = `${videoId}${extPath}`
        callback(null, newName);
    },
});

const upload = multer({ storage: storage });

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
    .post(upload.single('posterImage'), (req, res) => {
        const imagePath = req.file ? req.file.path : './images/new-video.jpg';
        const match = imagePath.match(/\\uploads\\(.+)/);
        const extractedPath = match ? match[0] : null;

        const { title, description } = req.body;
        const videoData = getVideos();
        const newVideo = {
            // id: crypto.randomUUID(),
            id: videoId,
            title: title,
            channel: "Reema Roy",
            image: extractedPath,
            description: description,
            views: 0,
            likes: 0,
            duration: "45:59",
            video: './video/video.mp4',
            timestamp: Date.now(),
            comments: []
        };
        videoData.push(newVideo);
        setVideos(videoData);
        res.status(200).send(newVideo);
    })

router
    .route("/:id")
    .get((req, res) => {
        const videoId = (req.params.id);

        const videoData = getVideos();
        const clickedVideoDetails = videoData.find((data) => {
            return data.id === videoId;
        })
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
    .delete((req, res) => {
        const videoId = req.params.videoId;
        const commentId = req.params.commentId;
        const videoData = getVideos();
        const foundVideo = videoData.find(video => video.id === videoId);
        if (foundVideo === -1) {
            return res.status(404).json({ error: "Video record not found" });
        }
        else {
            const foundComment = foundVideo.comments.findIndex(comment => comment.id === commentId)
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
    .put((req, res) => {
        const videoId = req.params.videoId;

        const videoData = getVideos();
        const foundVideo = videoData.find(video => video.id === videoId);
        if (typeof foundVideo.likes === "string") {
            if (foundVideo.likes.includes(',')) {
                const like = parseFloat(foundVideo.likes.replace(/,/g, '')) + 1;
                const strLike = like.toLocaleString('en-US');
                foundVideo.likes = strLike;
            }
        }
        else if (typeof foundVideo.likes === "number") {
            const like = foundVideo.likes + 1;
            foundVideo.likes = like;
        }
        setVideos(videoData);
        res.status(200).json(foundVideo.likes);
    })

module.exports = router;
