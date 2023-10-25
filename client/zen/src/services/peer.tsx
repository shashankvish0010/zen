class Peerconnection {
    peer: any
    addEventListener: any;
    constructor() {
        if (!this.peer) {

            this.peer = new RTCPeerConnection({
                "iceServers": [
                    {
                      "urls": "stun:global.stun.twilio.com:3478"
                    },
                    {
                      "username": "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
                      "credential": "tE2DajzSJwnsSbc123",
                      "urls": "turn:global.turn.twilio.com:3478?transport=udp"
                    },
                    {
                      "username": "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
                      "credential": "tE2DajzSJwnsSbc123",
                      "urls": "turn:global.turn.twilio.com:3478?transport=tcp"
                    },
                    {
                      "username": "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
                      "credential": "tE2DajzSJwnsSbc123",
                      "urls": "turn:global.turn.twilio.com:443?transport=tcp"
                    }
                  ],
                // iceServers: [
                //     {
                //       urls: "stun:stun.relay.metered.ca:80",
                //     },
                //     {
                //       urls: "turn:a.relay.metered.ca:80",
                //       username: "9feb6522d3b0d94f7d4bdc53",
                //       credential: "NBrSkTE3xWZTzRlx",
                //     },
                //     {
                //       urls: "turn:a.relay.metered.ca:80?transport=udp",
                //       username: "9feb6522d3b0d94f7d4bdc53",
                //       credential: "NBrSkTE3xWZTzRlx",
                //     },
                //     {
                //       urls: "turn:a.relay.metered.ca:443",
                //       username: "9feb6522d3b0d94f7d4bdc53",
                //       credential: "NBrSkTE3xWZTzRlx",
                //     },
                //     {
                //         urls: "turn:a.relay.metered.ca:443?transport=udp",
                //         username: "9feb6522d3b0d94f7d4bdc53",
                //         credential: "NBrSkTE3xWZTzRlx",
                //       },
                //     {
                //       urls: "turn:a.relay.metered.ca:443?transport=tcp",
                //       username: "9feb6522d3b0d94f7d4bdc53",
                //       credential: "NBrSkTE3xWZTzRlx",
                //     },
                // ],

            }
            )
        }
    }

    async generateOffer() {
        // console.log("enteroffer");
        try {
            if (this.peer) {
                const offer = await this.peer.createOffer()
                // console.log(offer);

                await this.peer.setLocalDescription(offer)
                return offer
            }
        } catch (error) {
            console.log('generateOffer', error);
        }
    }

    async generateAnswer(offer: RTCSessionDescriptionInit) {
        // console.log("Entering generateAnswer");
        // console.log("Received offer:", offer);

        if (this.peer) {
            try {
                // Set the remote description first
                await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
                // console.log("Remote description set with offer.");

                // Now create the answer and set the local description
                const answer = await this.peer.createAnswer();
                // console.log(answer);

                await this.peer.setLocalDescription(answer);
                // console.log("Answer created and local description set.");
                return answer;
            } catch (error) {
                console.error("Error generating answer:", error);
            }
        }
    }

    async setRemoteDescription(answer: RTCSessionDescriptionInit) {
        // console.log("enterremote", answer);
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