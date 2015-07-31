// EasySecurity.config({
//   ignoredMethods: ['roomCleanup', 'ping']
// });

Timers = {};

Meteor.setInterval(function() {
	Meteor.call("roomCleanup");
}, 1000);

Meteor.setInterval(function() {
	Meteor.call("playerCleanup");
}, 1600)