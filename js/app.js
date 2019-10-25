var apiKey = '46445182';
var sessionId = '1_MX40NjQ0NTE4Mn5-MTU3MTk0Nzk2MDM2NH5iS1IzOTd2QWhGaHQ0QTNXQWE3WXNEVjB-UH4';
var token = 'T1==cGFydG5lcl9pZD00NjQ0NTE4MiZzaWc9MmQyZjIyOGExZDgzYmE0N2QxYmZiNTYyNjJmNDQ2Y2JhZDE5ZTJiNzpzZXNzaW9uX2lkPTFfTVg0ME5qUTBOVEU0TW41LU1UVTNNVGswTnprMk1ETTJOSDVpUzFJek9UZDJRV2hHYUhRMFFUTlhRV0UzV1hORVZqQi1VSDQmY3JlYXRlX3RpbWU9MTU3MTk0ODA3NiZub25jZT0wLjgxOTMyMjU3OTEwMDQwNzMmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTU3MTk2OTY3NSZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}
  
// (optional) add server code here
initializeSession();
  
function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);
  
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
      session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);
});
  
// Create a publisher
var publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
}, handleError);
  
// Connect to the session
session.connect(token, function(error) {
      // If the connection is successful, initialize a publisher and publish to the session
    if (error) {
        handleError(error);
    } else {
        session.publish(publisher, handleError);
    }
    });
  }