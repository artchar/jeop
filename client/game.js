Template.game.helpers({
	redir: function() {
		Router.go('home');
	}
});

Meteor.setInterval(function() {
	if (Meteor.user() != null)
		Meteor.call("ping");
}, 3000);


// Meteor.setInterval(function() {
// 	if (Meteor.user().currentRoom)
// })

Accounts.onLogin(function() {
	Meteor.call("ping");
});

document.title = "J-PARTY";