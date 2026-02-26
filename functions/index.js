const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const express = require("express");
const { AuthorizationCode } = require("simple-oauth2");
const randomstring = require("randomstring");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const OAUTH_CLIENT_ID = defineSecret("OAUTH_CLIENT_ID");
const OAUTH_CLIENT_SECRET = defineSecret("OAUTH_CLIENT_SECRET");

const OAUTH_PROVIDER = process.env.OAUTH_PROVIDER || "github";
const OAUTH_GIT_HOSTNAME =
  process.env.OAUTH_GIT_HOSTNAME || "https://github.com";
const OAUTH_TOKEN_PATH =
  process.env.OAUTH_TOKEN_PATH || "/login/oauth/access_token";
const OAUTH_AUTHORIZE_PATH =
  process.env.OAUTH_AUTHORIZE_PATH || "/login/oauth/authorize";
const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL;
const OAUTH_SCOPES = process.env.OAUTH_SCOPES || "repo,user";

const oauthApp = express();

function getScript(mess, content) {
  return `<!doctype html><html><body><script>
  (function() {
    function receiveMessage(e) {
      if (e.origin !== '${CMS_ORIGIN}') return; 
      
      console.log("receiveMessage %o", e)
      window.opener.postMessage(
        'authorization:github:${mess}:${JSON.stringify(content)}',
        '${CMS_ORIGIN}'
      )
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false)
    console.log("Sending message: %o", "github")
    
    window.opener.postMessage("authorizing:github", '${CMS_ORIGIN}') 
    })()
  </script></body></html>`;
}

function getOAuthClient() {
  return new AuthorizationCode({
    client: {
      id: OAUTH_CLIENT_ID.value(),
      secret: OAUTH_CLIENT_SECRET.value(),
    },
    auth: {
      tokenHost: OAUTH_GIT_HOSTNAME,
      tokenPath: OAUTH_TOKEN_PATH,
      authorizePath: OAUTH_AUTHORIZE_PATH,
    },
  });
}

oauthApp.use(cookieParser());
oauthApp.use(cors({ origin: "https://sx7.dev" }));

oauthApp.get("/auth", (req, res) => {
  const oauth2Client = getOAuthClient();
  const state = randomstring.generate(32);

  res.cookie("oauth_state", state, {
    maxAge: 300000, // 5 minutes (plenty of time to log in)
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  const authorizationUri = oauth2Client.authorizeURL({
    redirect_uri: OAUTH_REDIRECT_URL,
    scope: OAUTH_SCOPES,
    state: state,
  });

  res.redirect(authorizationUri);
});

oauthApp.get("/callback", async (req, res) => {
  const returnedState = req.query.state;
  const savedState = req.cookies.oauth_state;
  const oauth2Client = getOAuthClient();
  const options = {
    code: req.query.code,
    redirect_uri: OAUTH_REDIRECT_URL,
  };

  res.clearCookie("oauth_state", { secure: true, sameSite: "none" });

  if (!savedState || returnedState !== savedState) {
    console.error("State mismatch. Possible CSRF attack.");
    return res
      .status(403)
      .send(getScript("error", { message: "Invalid state parameter" }));
  }

  if (OAUTH_PROVIDER === "gitlab") {
    options.client_id = OAUTH_CLIENT_ID.value();
    options.client_secret = OAUTH_CLIENT_SECRET.value();
    options.grant_type = "authorization_code";
  }

  try {
    const accessToken = await oauth2Client.getToken(options);
    return res.send(
      getScript("success", {
        token: accessToken.token.access_token,
        provider: OAUTH_PROVIDER,
      }),
    );
  } catch (error) {
    console.error("Access Token Error:", error.message);
    res.send(getScript("error", { message: error.message }));
  }
});

exports.oauth = onRequest(
  {
    secrets: [OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET],
    maxInstances: 3, // <--- Prevents billing spikes
    timeoutSeconds: 15, // <--- Kills stalled requests
  },
  oauthApp,
);
