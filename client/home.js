Template.home.helpers({
	redir: function(){
		Router.go("rooms");
	}
});

Template.home.events({

	"submit form": function(event) {
		event.preventDefault();
		var nick = event.target.nickname.value;
		var now = new Date().getTime();
		Accounts.createUser({username: nick, password: "feedle", profile: {currentRoom: null, currentSlot: null, lastPing: now, loggedIn: true}}, function(err) {
			if (err)
				console.log(err.error, err.reason, err.details);
			else {
				console.log("success");
			}
		});
		Router.go("rooms");
	},



});

