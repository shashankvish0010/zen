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
        if(this.peer){
        const offer = await this.peer.createOffer()
        await this.peer.setLocalDescription(new RTCSessionDescription(offer))
        return offer
        }
    }

    async genarateAnswer () {
        if(this.peer){
            await this.peer.setRemoteDescription()
            const answer = await this.peer.createAnswer()
            await this.peer.setLocalDescription( new RTCSessionDescription(answer) )
            return answer
        }
    }
    
}

export default new Peerconnection()