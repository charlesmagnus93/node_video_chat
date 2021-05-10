// const socket = io('localhost:3030', {path: '/'});
const socket = io('https://aaf2be9abac7.ngrok.io', {path: '/'});
// const socket = io('https://aaf2be9abac7.ngrok.io/');

let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: 'aaf2be9abac7.ngrok.io',
    // port: '3030',
});

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
})
.then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    // 
    peer.on('call', (call) => {
        alert("call " + call);
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })
});

const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
        // addVideoStream(video, userVideoStream);
        addRemoteStream(video, userVideoStream);
    });
}

peer.on('open', (id) => {
    socket.emit('join-room', ROOM_ID, id);
});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
        videoGrid.append(video);
    });
};

const addRemoteStream = (video, stream) => {
    alert('remote')
    video.srcObject = stream;
    const remote = document.getElementById("video-grid-remote");
    video.addEventListener('loadedmetadata', () => {
        video.play();
        remote.append(video);
    });
}

