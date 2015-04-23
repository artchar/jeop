Meteor.publish("rooms", function() {
	return Rooms.find({}, {
		fields: {
			roomPassword: false,
			clues: false,
		}
	});
})

Meteor.publish("currentRoom", function(id) {
	var inGame = false;
	for (i = 0; i < Rooms.findOne({_id: id}).players.length; i++) {
		if (this.userId == Rooms.findOne({_id: id}).players[i].playerid){
			return Rooms.find({_id: id}, {
			fields: {
				players: true,
				activeClue: true,
				activePlayer: true,
				"clues.category": true
			}
		});
		}
	}
	return {};
	
		
})