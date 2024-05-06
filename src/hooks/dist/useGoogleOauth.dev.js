"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var useGoogleOauth = function useGoogleOauth(clientId) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      onSuccess = _ref.onSuccess;

  var handleGoogleSignIn = function handleGoogleSignIn() {
    window.gapi.auth2.getAuthInstance().signIn().then(function (googleUser) {
      onSuccess(googleUser);
    }, function (error) {
      return;
    });
  };

  var checkIsSignedIn = function checkIsSignedIn() {
    return window.gapi.auth2.getAuthInstance().isSignedIn.get();
  };

  var signOut = function signOut() {
    return regeneratorRuntime.async(function signOut$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", window.gapi.auth2.getAuthInstance().signOut());

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  };

  (0, _react.useEffect)(function () {
    var initClient = function initClient() {
      return regeneratorRuntime.async(function initClient$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              console.log(window.gapi);
              _context2.next = 4;
              return regeneratorRuntime.awrap(window.gapi.client.init({
                clientId: clientId,
                scope: "profile email",
                plugin_name: 'App Name that you used in google developer console API'
              }));

            case 4:
              _context2.next = 9;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              console.error("Error initializing Google API client:", _context2.t0);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 6]]);
    };

    var loadGapi = function loadGapi() {
      if (!window.gapi) {
        var script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";

        script.onload = function () {
          window.gapi.load("client:auth2", initClient);
        };

        document.body.appendChild(script);
      } else {
        window.gapi.load("client:auth2", initClient);
      }
    };

    loadGapi();
  }, []);
  return {
    handleGoogleSignIn: handleGoogleSignIn,
    checkIsSignedIn: checkIsSignedIn,
    signOut: signOut
  };
};

var _default = useGoogleOauth;
exports["default"] = _default;