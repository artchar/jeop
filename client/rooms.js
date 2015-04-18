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
	}

});

Template.rooms.events({
	"submit #roomInfo": function(event) {
		event.preventDefault();
		var owner = Meteor.user().username;
		var roomName = event.target.roomName.value;
		var roomPassword = event.target.roomPassword.value;
		$("#createRoom").modal("hide");
		$("#roomName").val("");
		$("#roomPassword").val("");
		Meteor.call("addRoom", owner, roomName, roomPassword);
	},

	"click #signOut": function(event) {
		event.preventDefault();
		Meteor.logout();
	},

	"click .room-row": function (event) {
		alert("hi");
	}
});