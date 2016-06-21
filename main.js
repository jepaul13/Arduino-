var meshblu = require('meshblu')
var meshbluJSON = require('./meshblu.json')
var five = require("johnny-five")

// MESSAGE_SCHEMA defines what messages your device will be able to send from inside Octoblu
// currently this schema will allow you to toggle a property labeled reset inside Octoblu
var MESSAGE_SCHEMA = {
  "type": "object",
  "properties": {
    "greenLed": {
      "type": "boolean",
      "default": false
    },
    "blueLed": {
      "type": "boolean",
      "default": false
    },
    "redLed": {
      "type": "boolean",
      "default": false
    }
  }
}

// OPTIONS_SCHEMA defines what properties you can configure from your device's page in Octoblu
// currently this schema will allow you to set an integer in the device's page in Octoblu
// var OPTIONS_SCHEMA = {
//   "type": "object",
//   "properties": {
//     "myFavoriteNumber": {
//       "type": "integer",
//       "default": 4
//     }
//   }
// }

function sendMessage(message){
  conn.message({
    "devices": ["*"],
    "payload": message
  })
}

var uuid = meshbluJSON.uuid
var token = meshbluJSON.token

var conn = meshblu.createConnection({
  "uuid": uuid,
  "token": token
})

conn.on('notReady', function(data){
  console.log('UUID FAILED AUTHENTICATION!', data)
})

conn.on('config', function(device){
  // myFavoriteNumber = device.options.myFavoriteNumber
})

var arduino = new five.Board()

conn.on('ready', function(data){
  console.log('UUID AUTHENTICATED!', data)

  conn.whoami({}, function(device){
    // myFavoriteNumber = device.options.myFavoriteNumber
  })

  conn.update({
    "uuid": uuid,
    "messageSchema": MESSAGE_SCHEMA,
    // "optionsSchema": OPTIONS_SCHEMA,
    "type": "device:custom-arduino"
    // "logoUrl": "link to your image"
  })

  arduino.on("ready", function() {
    console.log('arduino ready')

    var green = new five.Pin(11)
    var blue = new five.Pin(10)
    var red = new five.Pin(9)

    conn.on('message', function(message){
      if (message.payload.greenLed == true) {
        green.high()
      }
      if (message.payload.greenLed == false) {
        green.low()
      }
      if (message.payload.blueLed == true) {
        blue.high()
      }
      if (message.payload.blueLed == false) {
        blue.low()
      }
      if (message.payload.redLed == true) {
        red.high()
      }
      if (message.payload.redLed == false) {
        red.low()
      }
    })
  })
})
