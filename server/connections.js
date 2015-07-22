Meteor.methods({
	ping: function() {
		var now = new Date().getTime();
		Meteor.users.update({_id: Meteor.userId()},
			{$set: {lastPing: now}
		});
	},

	playerCleanup: function() {
		var now = new Date().getTime();
		var players = Meteor.users.find({});
		players.forEach(function (player) {
			if (now - player.lastPing > 9000) {

				if (player.currentRoom != null || player.currentRoom != undefined) {

					var room = player.currentRoom;
					Rooms.update({_id: room}, 
						{$pull: {players: {playerid: player._id},
						 }
					});
				}

			}
		});
	}
});