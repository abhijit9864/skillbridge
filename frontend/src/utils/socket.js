import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";
const API_URL =
  import.meta.env.VITE_API_URL;

const SOCKET_URL =
  `${API_URL}/ws`;

let stompClient = null;

export const connectSocket = (
  userId,
  onMessage
) => {

  stompClient =
    new Client({

      webSocketFactory: () =>
        new SockJS(
          SOCKET_URL
        ),

      reconnectDelay: 5000,

      debug: (str) => {
        console.log(str);
      },

      onConnect: () => {

        console.log(
          "WebSocket Connected"
        );

        stompClient.subscribe(
          `/topic/notifications/${userId}`,
          (message) => {

            const notification =
              JSON.parse(
                message.body
              );

            onMessage(
              notification
            );
          }
        );
      },

      onStompError:
        (frame) => {

          console.error(
            "Broker error:",
            frame.headers[
              "message"
            ]
          );
        },
    });

  stompClient.activate();
};

export const disconnectSocket =
  () => {

    if (stompClient) {

      stompClient.deactivate();

      console.log(
        "WebSocket Disconnected"
      );
    }
  };