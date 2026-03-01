import { NextRequest } from "next/server";
import type { AuthPopupMessage } from "@/types/auth-popup";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const nonce = searchParams.get("nonce");
  const error = searchParams.get("error");

  const status: "success" | "error" = nonce && !error ? "success" : "error";
  const errorMessage = nonce ? error : "missing_nonce";

  const message: AuthPopupMessage = {
    type: "auth-popup",
    status,
    nonce: nonce || "",
    error: errorMessage || undefined,
  };

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Authentication</title>
</head>
<body>
  <script>
    (function() {
      var message = ${JSON.stringify(message)};
      var channelName = "patarutera-auth-popup-" + "${nonce || ""}";
      if (typeof BroadcastChannel !== "undefined") {
        new BroadcastChannel(channelName).postMessage(message);
      }
      if (window.opener) {
        window.opener.postMessage(message, window.location.origin);
      }
      try {
        window.close();
      } catch (e) {
        document.body.innerHTML = '<p>You can close this window.</p><a href="/">Return to site</a>';
      }
      if (!window.closed) {
        document.body.innerHTML = '<p>You can close this window.</p><a href="/">Return to site</a>';
      }
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
