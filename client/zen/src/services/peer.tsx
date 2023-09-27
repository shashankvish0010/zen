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
        
        if(this.peer){
        const offer = await this.peer.createOffer()
        await this.peer.setLocalDescription(new RTCSessionDescription(offer))
        return offer
        }
    }

    async genarateAnswer (offer: RTCSessionDescriptionInit) {
        console.log("enteranswer");

        if(this.peer){
            await this.peer.setRemoteDescription(offer)
            const answer = await this.peer.createAnswer()
            await this.peer.setLocalDescription(new RTCSessionDescription(answer))
            return answer
        }
    }

    async setlocalDescription (answer: RTCSessionDescriptionInit) {
        console.log("enterremote");

        if(this.peer){
           await this.peer.setRemoteDescription(answer)
        }
    }
    
}

export default new Peerconnection()