var meshblu = require('meshblu')
var meshbluJSON = require('./meshblu.json')
var five = require("johnny-five")

// MESSAGE_SCHEMA defines what messages your device will be able to send from inside Octoblu
// currently this schema will allow you to toggle a property labeled reset inside Octoblu
var MESSAGE_SCHEMA = {
  "type": "object",
  "properties": {
    "reset": {
      "type": "boolean",
      "default": false
    }
  }
}

// OPTIONS_SCHEMA defines what properties you can configure from your device's page in Octoblu
// currently this schema will allow you to set an integer in the device's page in Octoblu
var OPTIONS_SCHEMA = {
  "type": "object",
  "properties": {
    "myFavoriteNumber": {
      "type": "integer",
      "default": 4
    }
  }
}

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
  myFavoriteNumber = device.options.myFavoriteNumber
})

var edison = new five.Board({
  port: "/dev/ttyMFD1"
})

conn.on('ready', function(data){
  console.log('UUID AUTHENTICATED!', data)

  conn.whoami({}, function(device){
    myFavoriteNumber = device.options.myFavoriteNumber
  })

  conn.update({
    "uuid": uuid,
    "messageSchema": MESSAGE_SCHEMA,
    "optionsSchema": OPTIONS_SCHEMA,
    "type": "device:custom-device"
    // "logoUrl": "link to your image"
  })

  edison.on("ready", function() {
    console.log('edison ready')

    var zAccel = new five.Sensor.Analog(0)

    conn.on('message', function(message){
      if (message.reset == true) {
        console.log('reset')
      }
    })

    zAccel.on("change", function() {
      console.log("Z accelerometer: " + this.value)
    })
  })
})
