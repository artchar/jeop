Meteor.publish("rooms", function() {
	return Rooms.find({}, {
		fields: {
			roomPassword: false,
			clues: false,
		}
	});
})

Meteor.publish("currentRoom", function(id) {
	for (i = 0; i < Rooms.findOne({_id: id}).players.length; i++) {
		if (this.userId == Rooms.findOne({_id: id}).players[i].playerid) {
			if (Rooms.findOne({_id: id}).currentState != 0) {
				return Rooms.find({_id: id}, {
					fields: {
						players: true,
						activeClue: true,
						activePlayer: true,
						"clues.category": true,
						currentState: true,
						"clues.clues.selected": true
					}
				});
			}
			else {
				return Rooms.find({_id: id}, {
					fields: {
						players: true,
						activeClue: true,
						activePlayer: true,
						currentState: true,
						"clues.clues.selected": true
					}
				});
			}
		}
	}
	return Rooms.find({_id: null});
	
		
})