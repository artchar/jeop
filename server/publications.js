Meteor.publish("rooms", function() {
	return Rooms.find({}, {
		fields: {
			roomPassword: false,
			clues: false,
		}
	});
})

Meteor.publish("currentRoom", function(id) {
	return Rooms.find({_id: id}, {
		fields: {
			players: true,
			activeClue: true,
			activePlayer: true,
			"clues.category": true
		}
	});
})