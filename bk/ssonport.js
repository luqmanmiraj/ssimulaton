const express = require('express');
// const { RTCPeerConnection, RTCSessionDescription } = require('rtcpeerconnection');
var PeerConnection = require('rtcpeerconnection');


// init it like a normal peer connection object
// passing in ice servers/constraints the initial server config
// also takes a couple other options:
// debug: true (to log out all emitted events)
// var pc = new PeerConnection({config servers as usual}, {constraints as to regular PC});

const app = express();
const port = 3000;

// Serve the HTML file for screen sharing
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Expose the screen on a specific port
app.get('/stream/:port', (req, res) => {
    const { port } = req.params;

    // Create a new RTCPeerConnection
    const pc = new PeerConnection();

    // Add the screen as a video track
    pc.addScreenTrack()
        .then(() => {
            // Create the SDP offer
            return pc.createOffer();
        })
        .then((offer) => {
            // Set the local description
            return pc.setLocalDescription(offer);
        })
        .then(() => {
            // Send the SDP offer back as the response
            res.send(pc.localDescription.sdp);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error');
        });
});

// Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});