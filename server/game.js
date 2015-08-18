
// auto calling methods to clean up games and users that disconnect

Meteor.setInterval(function() {
	Meteor.call("roomCleanup");
}, 1000);

Meteor.setInterval(function() {
	Meteor.call("playerCleanup");
}, 6000)
