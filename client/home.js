Template.home.events({
	"submit form": function(event) {
		event.preventDefault();
		var nick = event.target.nickname.value;
		console.log(nick);
		Meteor.call("addUser", nick);
	}
})