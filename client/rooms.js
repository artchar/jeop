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

	loading: function() {
		if(Session.get("loading"))
			return true;
	}

});

Template.rooms.events({
	"submit #roomInfo": function(event, template) {
		event.preventDefault();

		$("#createRoom").modal("hide");
		var roomName = event.target.roomName.value;
		var roomPassword = event.target.roomPassword.value;
		var id = Meteor.userId();
		var gameid;
		$("#roomName").val("");
		$("#roomPassword").val("");
		Meteor.apply("addRoom", [roomName, roomPassword, Meteor.userId()], true, function(err, result){
			gameid = result;
		});

		var handle = Meteor.setInterval(function() {
			if (gameid != undefined) {
				Router.go("/rooms/" + gameid);
				Meteor.clearInterval(handle);
			}
			else{
				return;
			}
		}, 5);
			

	},

	"click #signOut": function(event) {
		event.preventDefault();
		Meteor.logout();
	},

	"click .room-row": function (event, template) {
		event.preventDefault();
		var gameid = event.currentTarget.id;
		var playerid = Meteor.userId();
		var playerName = Meteor.user().username;
		Session.set("loading", true);
		Meteor.call("joinRoom", playerid, playerName, gameid);
		
		Meteor.setTimeout(function() {
			Router.go("/rooms/" + gameid);
			Session.set("loading", false);
		}, 1500);
	}
});

Meteor.setInterval(function() {
	
})
