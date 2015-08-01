$(".pw").hide();
Session.setDefault("roomsearch", "");

Template.rooms.helpers({
	username: function() {
		if (Meteor.user() != null)
			return Meteor.user().username;
	},

	roomsList: function() {
		return Rooms.find({roomplayers: {$lt: 6}, roomName: {$regex:Session.get("roomsearch"), $options: 'i'}}, {sort: {roomName: 1}});
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

		Meteor.setTimeout(function() {
			Session.set("loading", true);
		}, 400);

		Meteor.setTimeout(function() {
			Meteor.call("addRoom", roomName, roomPassword, function(err, result){
				Session.set("loading", false);

				gameid = result;
				Router.go("/rooms/" + gameid);
			});
		}, 1200);
		// Meteor.setTimeout(function() {
		// 	var handle = Meteor.setInterval(function() {
		// 		if (gameid != undefined) {
		// 			Router.go("/rooms/" + gameid);
		// 			Meteor.clearInterval(handle);
		// 		}
		// 		else{
		// 			return;
		// 		}
		// 	}, 5);
		// 	}, 5000);

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
		$("#pw-" + gameid).toggle(400);
		// Session.set("loading", true);
		// Meteor.call("joinRoom", gameid);
		
		// Meteor.setTimeout(function() {
		// 	Router.go("/rooms/" + gameid);
		// 	Session.set("loading", false);
		// }, 1500);
	},

	"submit .pw": function(event, template) {
		event.preventDefault();
		var gameid = event.target.id;
		gameid = gameid.substr(3, gameid.length-1);

		var pw = event.target.password.value;
		Session.set("loading", true);
		
		Meteor.call("joinRoom", gameid, pw, function(err, result) {
			Session.set("loading", false);
			if (result) {
				Router.go("/rooms/" + gameid);
			}
			else {
				alert("wrong password");
			}
		});

	},

	"input #search": function(event, template) {
		event.preventDefault();
		Session.set("roomsearch", event.currentTarget.value);
	}
});
