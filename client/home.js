Template.home.events({
	"submit form": function(event) {
		event.preventDefault();
		var nick = event.target.nickname.value;
		Meteor.call("addUser", nick);
	},

	"click button": function(event) {
	}
});