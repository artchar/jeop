Template.game.helpers({
	redir: function() {
		Router.go('home');
	}
});

Meteor.setInterval(function() {
	Meteor.call("ping");
}, 5000);
