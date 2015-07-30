Template.game.helpers({
	redir: function() {
		Router.go('home');
	}
});

Meteor.setInterval(function() {
	Meteor.call("ping");
}, 3000);


// Meteor.setInterval(function() {
// 	if (Meteor.user().currentRoom)
// })
