Meteor.methods({
		addRoom:function(roomOwner, roomName, roomPassword, playerid) {

	// Pull random clue categories from the db
		var CATEGORIES_PER_GAME = 6;
		var randoms = [];
		for (i = 0; i < CATEGORIES_PER_GAME; i++) {
			var rand = Math.floor(Math.random() * Clues.find().count());
			randoms.push(rand);
		}

		var clueArray = [];

		for (i = 0; i < CATEGORIES_PER_GAME; i++) {
			clueArray.push({
				category: Clues.find().fetch()[randoms[i]].category,
				clues: [{
					question: Clues.find().fetch()[randoms[i]].clues[0].question,
					answer: Clues.find().fetch()[randoms[i]].clues[0].answer,
					selected: false
				},
				{
					question: Clues.find().fetch()[randoms[i]].clues[1].question,
					answer: Clues.find().fetch()[randoms[i]].clues[1].answer,
					selected: false
				},
				{
					question: Clues.find().fetch()[randoms[i]].clues[2].question,
					answer: Clues.find().fetch()[randoms[i]].clues[2].answer,
					selected: false
				},
				{
					question: Clues.find().fetch()[randoms[i]].clues[3].question,
					answer: Clues.find().fetch()[randoms[i]].clues[3].answer,
					selected: false
				},
				{
					question: Clues.find().fetch()[randoms[i]].clues[4].question,
					answer: Clues.find().fetch()[randoms[i]].clues[4].answer,
					selected: false
				}]
			});
		}
		

		var roomId = Rooms.insert({
			roomOwner: roomOwner,
			ownerId: playerid,
			roomName: roomName,
			roomPassword: roomPassword,
			clues: clueArray,
			roomplayers: 1,

			players: [{
				player: roomOwner,
				money: 0,
				playerid: playerid,
				readyStatus: true
			}],

			activeClue: "",

			activePlayer: playerid,

			answeringPlayer: null,

			currentState: 0


		});

	// Set user's current room to newly created room id
		Meteor.users.update({_id: this.userId},
			{$set: {currentRoom: roomId}});

		return roomId;
	},

	joinRoom: function(playerid, playerName, gameid) {
		Rooms.update({_id: gameid},
			{$inc: {roomplayers: 1},
			 $push: {players: {
			 	player: playerName,
			 	money: 0,
			 	playerid: playerid,
			 	readyStatus: false
			 }}});

		Meteor.users.update({_id: this.userId},
			{$set: {currentRoom: gameid}});

	},


	// Enter state 1: Current user can  select a clue
	startGame: function(gameId) {
		Rooms.update({_id: gameId},
			{$set: {
				currentState: 1
				}
			});

	},

	// Enter state 2: Show money value on the clue screen
	clickClue: function(cat, clue, gameId) {
		// Guard against client clicking buttons from console
		// if (Rooms.findOne({_id: gameId}).currentState != 1)
		// 	return;
		Rooms.update({_id: gameId},
			{$set: {
				currentState: 2
			}
		});
		var query = "clues." + cat + "." + "clues." + clue +".selected";
		var setClue = {};
		setClue[query] = true;

		Rooms.update({_id: gameId},
			{$set: setClue
		});

		// Enter state 3
		Meteor.setTimeout(function() {
			Rooms.update({_id: gameId},
				{$set: {
					currentState: 3
				}
			});
		}, 4000);

		// Enter state 4
		Meteor.setTimeout(function() {
			Rooms.update({_id: gameId},
				{$set: {
					currentState: 4
				}
			});
		}, 8000);


	},

	toggleReady: function(gameId, playerId) {
		var playerNumber, readyStatus;
		for (i = 0; i < Rooms.findOne({_id: gameId}).players.length; i++) {
			if (Rooms.findOne({_id: gameId}).players[i].playerid == playerId) {
				playerNumber = i;
				readyStatus = Rooms.findOne({_id: gameId}).players[playerNumber].readyStatus;
			}
		}
		var query = "players." + playerNumber + ".readyStatus";
		var setReady = {};

		// Toggle player's ready status
		setReady[query] = readyStatus ? false : true;
		Rooms.update({_id: gameId},
		 	{$set: setReady
		});
	}

});

/* states

0: pregame
1: player choosing a clue
2: money display, disable buttons, 2 seconds
3: clue display, 4 seconds
4: players buzzing in, 5 seconds
5: player answering, 5 seconds, back to state 1
6: if all clues selected, end game
*/