EasySecurity.config({
  ignoredMethods: ['roomCleanup']
});

Meteor.setInterval(function() {
	Meteor.call("roomCleanup");
}, 1000);