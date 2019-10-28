// var apiKey = '46445182';
// var sessionId = '1_MX40NjQ0NTE4Mn5-MTU3MTk0Nzk2MDM2NH5iS1IzOTd2QWhGaHQ0QTNXQWE3WXNEVjB-UH4';
// var token = 'T1==cGFydG5lcl9pZD00NjQ0NTE4MiZzaWc9MmQyZjIyOGExZDgzYmE0N2QxYmZiNTYyNjJmNDQ2Y2JhZDE5ZTJiNzpzZXNzaW9uX2lkPTFfTVg0ME5qUTBOVEU0TW41LU1UVTNNVGswTnprMk1ETTJOSDVpUzFJek9UZDJRV2hHYUhRMFFUTlhRV0UzV1hORVZqQi1VSDQmY3JlYXRlX3RpbWU9MTU3MTk0ODA3NiZub25jZT0wLjgxOTMyMjU3OTEwMDQwNzMmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTU3MTk2OTY3NSZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

// // Handling all of our errors here by alerting them
// function handleError(error) {
//     if (error) {
//         alert(error.message);
//     }
// }
  
// // (optional) add server code here
// initializeSession();
  
// function initializeSession() {
//     var session = OT.initSession(apiKey, sessionId);
  
//     // Subscribe to a newly created stream
//     session.on('streamCreated', function(event) {
//         session.subscribe(event.stream, 'subscriber', {
//             insertMode: 'append',
//             width: '100%',
//             height: '100%'
//         }, handleError);
//     });
  
//     // Create a publisher
//     var publisher = OT.initPublisher('publisher', {
//         insertMode: 'append',
//         width: '100%',
//         height: '100%'
//     }, handleError);
  
//     // Connect to the session
//     session.connect(token, function(error) {
//         // If the connection is successful, initialize a publisher and publish to the session
//         if (error) {
//             handleError(error);
//         } else {
//             session.publish(publisher, handleError);
//         }
//     });
// }

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;

// Importe el módulo para obtener una función de constructor para un objeto OpenTok
var OpenTok = require('opentok'), opentok = new OpenTok(apiKey, apiSecret);



// Para crear una sesión OpenTok
// Create a session that will attempt to transmit streams directly between
// clients. If clients cannot connect, the session uses the OpenTok TURN server:
opentok.createSession(function(err, session) {
    if (err){
        return console.log(err);
    } 
  
    // save the sessionId
    db.save('session', session.sessionId, done);
});
  
// The session will the OpenTok Media Router:
opentok.createSession({mediaMode:"routed"}, function(err, session) {
    if (err) { 
        return console.log(err);
    }

    // save the sessionId
    db.save('session', session.sessionId, done);
});
  
// A Session with a location hint
opentok.createSession( { location: '12.34.56.78' }, function(err, session) {
    if (err) { 
        return console.log(err);
    }

    // save the sessionId
    db.save('session', session.sessionId, done);
});

// A Session with an automatic archiving
opentok.createSession( { mediaMode: 'routed', archiveMode: 'always' }, function(err, session) {
    if (err){
        return console.log(err);
    } 

    // save the sessionId
    db.save('session', session.sessionId, done);
});




// Una vez que se crea una sesión, puede comenzar a generar tokens
token = opentok.generateToken(sessionId);

// Generate a Token from a session object (returned from createSession)
token = session.generateToken();

// Set some options in a Token
token = session.generateToken({
    role : 'moderator',
    expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
    data : 'name=prueba',
    initialLayoutClassList : ['focus']
});



// Por defecto, todas las transmisiones se graban en un solo archivo -> outputMode: 'individual'
// opciones de grabacion audio y video -> hasAudio y hasVideo
var archiveOptions = {
    name: 'Important Presentation',
    hasVideo: false,
    hasAudio: false//,
    //outputMode: 'individual'
};

opentok.startArchive(sessionId, archiveOptions, function(err, archive) {
    if (err) {
      return console.log(err);
    } else {
      // The id property is useful to save off into a database
      console.log("new archive:" + archive.id);
    }
});




// Puede detener la grabación de un archivo iniciado
opentok.stopArchive(archiveId, function(err, archive) {
    if (err) {
        return console.log(err);
    }
  
    console.log("Stopped archive:" + archive.id);
});

archive.stop(function(err, archive) {
    if (err) {
        return console.log(err);
    }
});



// Para obtener una Archiveinstancia (y toda la información sobre ella) de un archiveId
opentok.getArchive(archiveId, function(err, archive) {
    if (err) {
        return console.log(err);
    }
  
    console.log(archive);
});


// Para eliminar un archivo
// Delete an Archive from an archiveId (fetched from database)
opentok.deleteArchive(archiveId, function(err) {
    if (err) {
        return console.log(err);
    }
});
  
// Delete an Archive from an Archive instance, returned from the OpenTok.startArchive(),
// OpenTok.getArchive(), or OpenTok.listArchives() methods
archive.delete(function(err) {
    if (err) {
        return console.log(err);
    }
});




// También puede obtener una lista de todos los archivos que ha creado (hasta 1000) con su clave API
opentok.listArchives( { offset: 100, count: 50 }, function(error, archives, totalCount) {
    if (error) {
        return console.log(error);
    }
  
    console.log(totalCount + " archives");

    for (var i = 0; i < archives.length; i++) {
        console.log(archives[i].id);
    }
});



// Tenga en cuenta que también puede crear una sesión archivada automáticamente
opentok.setArchiveLayout(archiveId, type, null, function (err) {
    if (err) {
        return console.log(err);
    }
});





// Transmisiones en Vivo
var broadcastOptions = {
    outputs: {
        hls: {},
        rtmp: [{
            id: 'foo',
            serverUrl: 'rtmp://myfooserver/myfooapp',
            streamName: 'myfoostream'
        },
        {
            id: 'bar',
            serverUrl: 'rtmp://mybarserver/mybarapp',
            streamName: 'mybarstream'
        }]
    },
    maxDuration: 5400,
    resolution: '640x480',
    layout: {
        type: 'verticalPresentation'
    }
};

opentok.startBroadcast(broadcastOptions, options, function(error, broadcast) {
    if (error) {
        return console.log(error);
    }

    return console.log('Broadcast started: ', broadcast.id);
});




// Puede detener un pase de transmisión de transmisión en vivo
opentok.stopBroadcast(broadcastId, function(error, broadcast) {
    if (error) {
        return console.log(error);
    }
    return console.log('Broadcast stopped: ', broadcast.id);
});




// También puede obtener una lista de todas las transmisiones que ha creado (hasta 1000) con su clave API
opentok.listBroadcasts({offset:100, count:50}, function(error, broadcasts, totalCount) {
    if (error) {
        return console.log(error);
    }

    console.log(totalCount + " broadcasts");

    for (var i = 0; i < broadcasts.length; i++) {
        console.log(broadcasts[i].id);
    }
});




// Puede enviar una señal a todos los participantes en una sesión OpenTok
var sessionId = '2_MX2xMDB-flR1ZSBOb3YgMTkgMTE6MDk6NTggUFNUIDIwMTN-MC2zNzQxNzIxNX2';

opentok.signal(sessionId, null, { 'type': 'chat', 'data': 'Hello!' }, function(error) {
    if (error) {
        return console.log(error);
    }
});



// O envíe una señal a un participante específico
var sessionId = '2_MX2xMDB-flR1ZSBOb3YgMTkgMTE6MDk6NTggUFNUIDIwMTN-MC2zNzQxNzIxNX2';
var connectionId = '02e80876-02ab-47cd-8084-6ddc8887afbc';

opentok.signal(sessionId, connectionId, { 'type': 'chat', 'data': 'Hello!' }, function(error) {
    if (error) {
        return console.log(error);
    }
});




// Puede desconectar a los participantes de una sesión OpenTok
opentok.forceDisconnect(sessionId, connectionId, function(error) {
    if (error) {
        return console.log(error);
    }
});




// Puede obtener información sobre una transmisión activa en una sesión de OpenTok
var sessionId = '2_MX6xMDB-fjE1MzE3NjQ0MTM2NzZ-cHVTcUIra3JUa0kxUlhsVU55cTBYL0Y1flB';
var streamId = '2a84cd30-3a33-917f-9150-49e454e01572';

opentok.getStream(sessionId, streamId, function(error, streamInfo) {
    if (error) {
        return console.log(error.message);
    } else {
        console.log(stream.id); // '2a84cd30-3a33-917f-9150-49e454e01572'
        console.log(stream.videoType); // 'camera'
        console.log(stream.name); // 'Bob'
        console.log(stream.layoutClassList); // ['main']
    }
});




// Para obtener información sobre todas las transmisiones activas en una sesión
opentok.listStreams(sessionId, function(error, streams) {
    if (error) {
        console.log(error.message);
    } else {
        streams.map(function(stream) {
            console.log(stream.id); // '2a84cd30-3a33-917f-9150-49e454e01572'
            console.log(stream.videoType); // 'camera'
            console.log(stream.name); // 'Bob'
            console.log(stream.layoutClassList); // ['main']
        });
    }
});