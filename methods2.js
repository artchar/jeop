Meteor.methods({


	joinRoom: function(playerid, playerName, gameid) {
		Rooms.update({_id: gameid},
			{$inc: {roomplayers: 1},
			 $push: {players: {
			 	player: playerName,
			 	money: 0,
			 	playerid: playerid
			 }}});

	},

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
		console.log(setClue[query]);
		console.log("hi");
		Rooms.update({_id: gameId},
			{$set: setClue
		});
	}
})