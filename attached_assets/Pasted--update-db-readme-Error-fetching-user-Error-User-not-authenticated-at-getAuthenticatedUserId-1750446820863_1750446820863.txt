/update-db#readme
Error fetching user: Error: User not authenticated
    at getAuthenticatedUserId (/home/runner/workspace/server/routes.ts:111:13)
    at <anonymous> (/home/runner/workspace/server/routes.ts:120:28)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
    at next (/home/runner/workspace/node_modules/express/lib/router/route.js:149:13)
    at Route.dispatch (/home/runner/workspace/node_modules/express/lib/router/route.js:119:3)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
    at /home/runner/workspace/node_modules/express/lib/router/index.js:284:15
    at Function.process_params (/home/runner/workspace/node_modules/express/lib/router/index.js:346:12)
    at next (/home/runner/workspace/node_modules/express/lib/router/index.js:280:10)
    at strategy.pass (/home/runner/workspace/node_modules/passport/lib/middleware/authenticate.js:355:9)
    at SessionStrategy.authenticate (/home/runner/workspace/node_modules/passport/lib/strategies/session.js:126:10)
    at attempt (/home/runner/workspace/node_modules/passport/lib/middleware/authenticate.js:378:16)
    at authenticate (/home/runner/workspace/node_modules/passport/lib/middleware/authenticate.js:379:7)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/runner/workspace/node_modules/express/lib/router/index.js:328:13)
    at /home/runner/workspace/node_modules/express/lib/router/index.js:286:9
    at Function.process_params (/home/runner/workspace/node_modules/express/lib/router/index.js:346:12)
    at next (/home/runner/workspace/node_modules/express/lib/router/index.js:280:10)
    at initialize (/home/runner/workspace/node_modules/passport/lib/middleware/initialize.js:98:5)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/runner/workspace/node_modules/express/lib/router/index.js:328:13)
    at /home/runner/workspace/node_modules/express/lib/router/index.js:286:9
    at Function.process_params (/home/runner/workspace/node_modules/express/lib/router/index.js:346:12)
    at next (/home/runner/workspace/node_modules/express/lib/router/index.js:280:10)
    at session (/home/runner/workspace/node_modules/express-session/index.js:487:7)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/runner/workspace/node_modules/express/lib/router/index.js:328:13)
    at /home/runner/workspace/node_modules/express/lib/router/index.js:286:9
    at Function.process_params (/home/runner/workspace/node_modules/express/lib/router/index.js:346:12)
    at next (/home/runner/workspace/node_modules/express/lib/router/index.js:280:10)
    at <anonymous> (/home/runner/workspace/server/index.ts:39:3)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/runner/workspace/node_modules/express/lib/router/index.js:328:13)
    at /home/runner/workspace/node_modules/express/lib/router/index.js:286:9
    at Function.process_params (/home/runner/workspace/node_modules/express/lib/router/index.js:346:12)
    at next (/home/runner/workspace/node_modules/express/lib/router/index.js:280:10)
    at urlencodedParser (/home/runner/workspace/node_modules/body-parser/lib/types/urlencoded.js:94:7)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/runner/workspace/node_modules/express/lib/router/index.js:328:13)
    at /home/runner/workspace/node_modules/express/lib/router/index.js:286:9
    at Function.process_params (/home/runner/workspace/node_modules/express/lib/router/index.js:346:12)
    at next (/home/runner/workspace/node_modules/express/lib/router/index.js:280:10)
    at jsonParser (/home/runner/workspace/node_modules/body-parser/lib/types/json.js:113:7)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
    at trim_prefix (/home/runner/workspace/node_modules/express/lib/router/index.js:328:13)
    at /home/runner/workspace/node_modules/express/lib/router/index.js:286:9
    at Function.process_params (/home/runner/workspace/node_modules/express/lib/router/index.js:346:12)
    at next (/home/runner/workspace/node_modules/express/lib/router/index.js:280:10)
    at expressInit (/home/runner/workspace/node_modules/express/lib/middleware/init.js:40:5)
    at Layer.handle [as handle_request] (/home/runner/workspace/node_modules/express/lib/router/layer.js:95:5)
7:08:41 PM [express] GET /api/auth/user 500 in 29ms :: {"message":"Failed to fetch us