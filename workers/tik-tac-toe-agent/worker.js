/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { simulateAIMove } from "./simulateAIMove.js";

export default {
  async fetch(request, env, ctx) {
    const responseHeaders = new Headers();

    // Allow all origins
    responseHeaders.set("Access-Control-Allow-Origin", "*");

    // Allow necessary methods
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    // Allow all headers
    responseHeaders.set("Access-Control-Allow-Headers", "*");

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      // Preflight response for CORS
      return new Response(null, {
        headers: responseHeaders,
        status: 204, // No Content
      });
    }

    // Handle actual requests
    try {
      const { boardState, turn } = await request.json(); // Parse JSON body
      console.log("request", { boardState, turn });

      const move = await simulateAIMove(boardState, turn);

      const responseBody = {
        move: move,
      };

      return new Response(JSON.stringify(responseBody), {
        headers: responseHeaders,
        status: 200,
      });
    } catch (e) {
      return new Response("Invalid request body", {
        headers: responseHeaders,
        status: 400,
      });
    }
  },
};
