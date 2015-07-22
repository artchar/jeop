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

					if (player._id == Rooms.findOne({_id: room}).ownerId){
						if (Rooms.findOne({_id: room}).roomplayers > 1) {
							Rooms.update({_id: room}, 
								{$set: {roomOwner: Rooms.findOne(room).players[1].player,
										ownerId: Rooms.findOne(room).players[1].playerid}});

						}
					}

					if (player._id == Rooms.findOne({_id: room}).activePlayer) {
						if (Rooms.findOne({_id: room}).roomplayers > 1) {
							Rooms.update({_id: room}, 
								{$set: {activePlayer: Rooms.findOne(room).players[1].playerid}});

						}
					}

					if (player._id == Rooms.findOne({_id: room}).answeringPlayer) {
						if (Rooms.findOne({_id: room}).roomplayers > 1) {
							Rooms.update({_id: room}, {
								$set: {
										currentState: 4,
										answeringPlayer: null,
										currentPlayerAnswer: null,
										currentAnswerCorrect: null,
										correctAnswer: null
								   	  }
							});

						}
					}


				var query = "players.0.readyStatus";
				var setReady = {};
				setReady[query] = true;
				var p = Rooms.findOne({_id: room}).roomplayers;
				var gameId = room;
				var userId = player._id;
				var slot = player.playerSlot;

				for (i = slot+1; i < p; i++) {
					Meteor.users.update({_id: Rooms.findOne({_id: gameId}).players[i].playerid},
						{$inc: {playerSlot: -1}});
				}

				Rooms.update({_id: room}, 
					{$pull: {players: {playerid: userId},
					 }
					});

				Rooms.update({_id: room}, 
					{$inc: {roomplayers: -1}
					 }
					);
				
				Rooms.update({_id: room}, 
					{$set: setReady
					 }
					);
				var handle2 = Meteor.setInterval(function() {
					if (Rooms.findOne({_id: gameId}).roomplayers != p) {

						Meteor.users.update({_id: userId},
							{$set: {currentRoom: null, playerSlot: null}
						});
						Meteor.clearInterval(handle2);
					}
					else{
						return;
					}
				}, 5);
				}

			}
		});
	}
});