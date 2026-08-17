import { Server, createKeyRouteDispatcher } from "@mikdash/server";
import { exampleHandler } from "./example-handler.js";
import { kadeshHandler } from "./kadesh/resolver.js"
import { korechHandler } from "./korech/resolver.js"

const handlerTree = { 
  example: exampleHandler, 
  kadesh: kadeshHandler,
  korech: korechHandler
};

const server = new Server({
  port: 3000,
  routes: {
    api: { post: createKeyRouteDispatcher(handlerTree) },
  },
});

/*
  Test the 'example' key route (POST /api). Replace <id> with the id from the write response.

  1) Read (list all)
  curl -X POST http://localhost:3000/api -H "Content-Type: application/json" -d '{"route":"example","action":"read","payload":{}}'

  2) Write (create)
  curl -X POST http://localhost:3000/api -H "Content-Type: application/json" -d '{"route":"example","action":"write","payload":{"title":"Test item","done":false}}'

  3) Update
  curl -X POST http://localhost:3000/api -H "Content-Type: application/json" -d '{"route":"example","action":"update","payload":{"id":"daf986c1-8c9a-42b8-8f86-3c9d8642ba80","done":true}}'

  4) Delete
  curl -X POST http://localhost:3000/api -H "Content-Type: application/json" -d '{"route":"example","action":"delete","payload":{"id":"daf986c1-8c9a-42b8-8f86-3c9d8642ba80"}}'
*/
