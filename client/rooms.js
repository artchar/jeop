Template.rooms.helpers({
	username: function() {
		if (Meteor.user() != null)
			return Meteor.user().username;
	},

	roomsList: function() {
		return Rooms.find();
	},

	redir: function() {
		Router.go('home');
	},

});

Template.rooms.events({
	"submit #roomInfo": function(event, template) {
		event.preventDefault();

		$("#createRoom").modal("hide");
		var owner = Meteor.user().username;
		var roomName = event.target.roomName.value;
		var roomPassword = event.target.roomPassword.value;
		var id = Meteor.userId();
		$("#roomName").val("");
		$("#roomPassword").val("");
		Meteor.call("addRoom", owner, roomName, roomPassword, Meteor.userId());

		var gameid = Rooms.findOne({activePlayer: id})._id;

		Meteor.setTimeout(function() {
			Router.go("/rooms/" + gameid);
		}, 1000);
	},

	"click #signOut": function(event) {
		event.preventDefault();
		Meteor.logout();
	},

	"click .room-row": function (event, template) {
		event.preventDefault();
		var gameid = event.currentTarget.id;
		Router.go("/rooms/" + gameid);
	}


});