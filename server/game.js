// EasySecurity.config({
//   ignoredMethods: ['roomCleanup', 'ping']
// });

Meteor.setInterval(function() {
	Meteor.call("roomCleanup");
}, 1000);

Meteor.setInterval(function() {
	Meteor.call("playerCleanup");
}, 1000)