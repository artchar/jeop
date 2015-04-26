Meteor.methods({



	startGame: function(gameId) {
		Rooms.update({_id: gameId},
			{$set: {
				currentState: 1
				}
			});

	},

	clickClue: function(cat, clue, gameId) {
		var query = "clues." + cat + "." + "clues." + clue +".selected";
		var setClue = {};
		setClue[query] = true;
		Rooms.update({_id: gameId},
			{$set: setClue
		});
	}
})