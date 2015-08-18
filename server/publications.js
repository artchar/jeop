// access to current user's profile
Meteor.publish("user", function() {
	return Meteor.users.find({_id: this.userId});
})

// see rooms on rooms page
Meteor.publish("rooms", function() {
	return Rooms.find({currentState: 0}, {
		fields: {
			roomPassword: false,
			clues: false
		}
	});
})

// access to current room's data
Meteor.publish("currentRoom", function(id) {
	return Rooms.find({_id: id}, {
		fields: {
			"activeClue.index": true,
			players: true,
			"activeClue.question": true,
			"activeClue.worth": true,
			"activeClue.category": true,
			"activeClue.comments": true,
			activePlayer: true,
			currentState: true,
			"clues.category": true,
			"clues.comments": true,
			"clues.clues.selected": true,
			ownerId: true,
			answeringPlayer: true,
			currentPlayerAnswer: true,
			currentAnswerCorrect: true,
			correctAnswer: true,
			roomplayers: true,
			cluePickTimer: true,
			answerTimer: true,
			clueActiveTimer: true,
			buzzTimer: true,
			cluesDone: true
		}
	});
});
