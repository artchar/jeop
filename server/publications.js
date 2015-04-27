Meteor.publish("user", function() {
	return Meteor.users.find({_id: this.userId});
})

Meteor.publish("rooms", function() {
	return Rooms.find({currentState: 0}, {
		fields: {
			roomPassword: false,
			clues: false
		}
	});
})

Meteor.publish("currentRoom", function(id) {
	for (i = 0; i < Rooms.findOne({_id: id}).players.length; i++) {
		if (this.userId == Rooms.findOne({_id: id}).players[i].playerid) {
				return Rooms.find({_id: id}, {
					fields: {
						players: true,
						"activeClue.question": true,
						"activeClue.worth": true,
						activePlayer: true,
						currentState: true,
						"clues.category": true,
						"clues.clues.selected": true,
						ownerId: true,
						answeringPlayer: true
					}
				});
			}
		}

	return Rooms.find({_id: null});
	});
