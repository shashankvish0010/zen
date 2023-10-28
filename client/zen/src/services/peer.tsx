class Peerconnection {
    peer: any
    addEventListener: any;
    constructor() {

        if (!this.peer) {

            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.relay.metered.ca:80"
                    },
                    {
                        urls: "turn:a.relay.metered.ca:80",
                        username: "9feb6522d3b0d94f7d4bdc53",
                        credential: "NBrSkTE3xWZTzRlx"
                    },
                    {
                        urls: "turn:a.relay.metered.ca:80?transport=tcp",
                        username: "9feb6522d3b0d94f7d4bdc53",
                        credential: "NBrSkTE3xWZTzRlx"
                    },
                    {
                        urls: "turn:a.relay.metered.ca:443",
                        username: "9feb6522d3b0d94f7d4bdc53",
                        credential: "NBrSkTE3xWZTzRlx"
                    },
                    {
                        urls: "turn:a.relay.metered.ca:443?transport=tcp",
                        username: "9feb6522d3b0d94f7d4bdc53",
                        credential: "NBrSkTE3xWZTzRlx"
                    }
                ],
            }
            )
        }
    }

    async generateOffer() {
        try {
            if (this.peer) {
                const offer = await this.peer.createOffer()
                await this.peer.setLocalDescription(offer)
                return offer
            }
        } catch (error) {
            console.log('generateOffer', error);
        }
    }

    async generateAnswer(offer: RTCSessionDescriptionInit) {
        if (this.peer) {
            try {
                await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await this.peer.createAnswer();
                await this.peer.setLocalDescription(answer);
                return answer;
            } catch (error) {
                console.error("Error generating answer:", error);
            }
        }
    }

    async setRemoteDescription(answer: RTCSessionDescriptionInit) {
        try {
            if (this.peer) {
                await this.peer.setRemoteDescription(new RTCSessionDescription(answer)).then(() => console.log("Answer recieved and remote description set.")).catch((error: any) => console.log("error", error))
            }
        } catch (error) {
            console.log('setlocalDescription', error);
        }
    }
}

export default new Peerconnection()