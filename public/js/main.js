/////////////////////   Client

var peer = null;


// Đảm bảo rằng đoạn mã javacript đã được thực thi khi DOM đc hoành thành
$(document).ready(function() {

        const socket = io('http://localhost:3001');
        const peer = new Peer(null, {
        host: "localhost",
        port: 9090,
        path: "/peerserver",
    });

    peer.on('open', function(id) {
        // Display the peer ID in the 'mydiv' element
        $("#mydiv").text("Your ID: " + id);
        console.log("Your ID: " + id);

        $('#btnSignUp').click(() => {
            const username = $('#txtUsername').val();
            socket.emit('NGUOI_DUNG_DANG_KY', {name: username, peerId: id});
        });
    });

    $('#div-chat').hide();

    socket.on('DANH_SACH_ONLINE', arrUserInfo => {
        $('#div-chat').show();
        $('#div-dang-ky').hide();

        arrUserInfo.forEach(user => {
            const {name, peerId} = user;
            $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
        });

        socket.on('CO_NGUOI_DUNG_MOI', user => {
            const {name, peerId} = user;
            $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
        });

        socket.on('USER_DISCONNECTED', peerId => {
            $(`#${peerId}`).remove(); //goi dc $ o peeerId vi da cho peerId vao tung the <li></li>
        });
    });

    socket.on('DANG_KY_THAT_BAI', () => alert('Vui long chon username khac!'));


    function openStream() {
        const config = { audio: false, video: true };
        return navigator.mediaDevices.getUserMedia(config);
    }

    function playStream(idVideoTag, stream) {
        const video = document.getElementById(idVideoTag);
        video.srcObject = stream;
        video.play();
    }

    openStream().then(stream => playStream('localStream', stream));

    // Caller: người gọi
    $("#btnCall").click(() => {
        const id = $("#remoteID").val();
        openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
    });

    // Callee: người nhận
    peer.on('call', call => {
        openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
    });

    // socket.on('connect', () => {
    //     console.log('Connected to the server');
    // });

   $('#ulUser').on('click', 'li', function() {
        const id = $(this).attr('id');

        openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        });
   });

});



////////////////////////////////////

/*const CONFIG_NON_STUN_TURN_SERVER = {
    host: "127.0.0.1",
    port: 9090,
    path: '/peerserver'    
};

let peer = new Peer('null', CONFIG_NON_STUN_TURN_SERVER);*/