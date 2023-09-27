class Peerconnection {
     peer: any
     constructor () {
        if(!this.peer){
            this.peer = new RTCPeerConnection({
                iceServers : [
                    {
                        urls : [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478"
                        ]
                    }
                ]
            })
        }
    }

    async generateOffer () {
        console.log("enteroffer");
        try {
            if(this.peer){
                const offer = await this.peer.createOffer()        
                await this.peer.setLocalDescription(new RTCSessionDescription(offer))
                return offer
                }
        } catch (error) {
            console.log('generateOffer', error);
        }
    }

    // async generateAnswer (offer: RTCSessionDescriptionInit) {
    //     console.log("enteranswer");
    //         if(this.peer){
    //             try {

    //             await this.peer.setRemoteDescription(offer)
    //             const answer = await this.peer.createAnswer()
    //             console.log(answer);
    //             await this.peer.setLocalDescription(new RTCSessionDescription(answer))
    //             return answer
    //         }
    //      catch (error) {
    //         console.log('genarateAnswer', error);
    //     }
    // }
    // }

    async generateAnswer(offer: RTCSessionDescriptionInit) {
        console.log("Entering generateAnswer");
        console.log("Received offer:", offer);
    
        if (this.peer) {
            try {
                // Set the remote description first
                await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
                console.log("Remote description set with offer.");
    
                // Now create the answer and set the local description
                const answer = await this.peer.createAnswer();
                await this.peer.setLocalDescription(new RTCSessionDescription(answer));
                console.log("Answer created and local description set.");
                return answer;
            } catch (error) {
                console.error("Error generating answer:", error);
            }
        }
    }
    

    async setRemoteDescription (answer: RTCSessionDescriptionInit) {
        console.log("enterremote");
        try {
            if(this.peer){
                await this.peer.setRemoteDescription(new RTCSessionDescription(answer))
             }
        } catch (error) {
            console.log('setlocalDescription', error);
        }
    }
    
}

export default new Peerconnection()

// class Peerconnection {
//     peer: any;

//     constructor() {
//         if (!this.peer) {
//             this.peer = new RTCPeerConnection({
//                 iceServers: [
//                     {
//                         urls: [
//                             "stun:stun.l.google.com:19302",
//                             "stun:global.stun.twilio.com:3478"
//                         ]
//                     }
//                 ]
//             });
//         }
//     }

//     async generateOffer() {
//         console.log("Entering generateOffer");
//         if (this.peer) {
//             try {
//                 const offer = await this.peer.createOffer();
//                 await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//                 console.log("Offer created and local description set.");
//                 return offer;
//             } catch (error) {
//                 console.error("Error generating offer:", error);
//             }
//         }
//     }

//     async generateAnswer(offer: RTCSessionDescriptionInit) {
//         console.log("Entering generateAnswer");
//         console.log("Received offer:", offer);

//         if (this.peer) {
//             try {
//                 await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//                 console.log("Remote description set with offer.");
//                 const answer = await this.peer.createAnswer()
//                 await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//                 console.log("Answer created and local description set.");
//                 return answer;
//             } catch (error) {
//                 console.error("Error generating answer:", error);
//             }
//         }
//     }

//     async setRemoteDescription(answer: RTCSessionDescriptionInit) {
//         console.log("Entering setRemoteDescription");
//         if (this.peer) {
//             try {
//                 await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
//                 console.log("Remote description set with answer.");
//             } catch (error) {
//                 console.error("Error setting remote description:", error);
//             }
//         }
//     }
// }

// export default new Peerconnection();
