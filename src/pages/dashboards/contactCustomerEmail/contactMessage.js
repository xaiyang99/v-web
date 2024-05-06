import { useState } from "react";
import { GoogleLogin } from "react-google-login";
/* global gapi */
const clientId =
  "544951590656-ogrch9lairheq66a5fi3cc6utremsqqh.apps.googleusercontent.com";

function GmailApiExample() {
  const [messages, setMessages] = useState([]);

  // const onSuccess = (res) => {
  const onSuccess = () => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: "AIzaSyCmDHDZC5Hz4gvnakknnPFB3MRtzJyaZZA",
          clientId: clientId,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope: "https://www.googleapis.com/auth/gmail.readonly",
        })
        .then(() => {
          gapi.client.gmail.users.messages
            .list({
              userId: "me",
              maxResults: 10,
            })
            .then((response) => {
              setMessages(response.result.messages);
            });
        });
    });
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={(res) => console.error(res)}
        cookiePolicy={"single_host_origin"}
        scope="https://www.googleapis.com/auth/gmail.readonly"
      />
      <ul>
        {messages?.map((message) => (
          <li key={message.id}>{message.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default GmailApiExample;
