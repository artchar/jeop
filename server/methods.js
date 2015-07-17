
Meteor.methods({
	addRoom:function(roomName, roomPassword) {
		
		if (Meteor.user().currentRoom != null)
			return;

		var playerid = Meteor.userId();
		var roomOwner = Meteor.user().username;
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
				readyStatus: true,
				buzzInAbility: false,
				incorrect: false
			}],

			// Category and clue indexes help check if a given answer is correct
			activeClue: {
				question: null,
				answer: null,
				worth: null
			},

			activePlayer: playerid,

			answeringPlayer: null,

			currentState: 0,

			canBuzzIn: false,

			currentPlayerAnswer: null,

			currentAnswerCorrect: null,

			correctAnswer: null


		});


	// Set user's current room to newly created room id
		Meteor.users.update({_id: this.userId},
			{$set: {currentRoom: roomId,
					playerSlot: 0}});

		return roomId;
	},

	joinRoom: function(playerid, playerName, gameid) {

		if (Meteor.user().currentRoom != null)
			return;
		Rooms.update({_id: gameid},
			{$inc: {roomplayers: 1},
			 $push: {players: {
			 	player: playerName,
			 	money: 0,
			 	playerid: playerid,
			 	readyStatus: false,
			 	incorrect: false
			 }}});


		var players = Rooms.findOne({_id: gameid}).roomplayers - 1;

		Meteor.users.update({_id: this.userId},
			{$set: {currentRoom: gameid, playerSlot: players}});

	},


	// Enter state 1: Current user can  select a clue
	startGame: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).ownerId != this.userId || Rooms.findOne({_id: Meteor.user().currentRoom}).currentState != 0) {
			return;
		}

		for (i = 0; i < Rooms.findOne({_id: Meteor.user().currentRoom}).players.length; i++) {
			if (Rooms.findOne({_id: Meteor.user().currentRoom}).players[i].readyStatus != true)
				return;
		}

		Rooms.update({_id: Meteor.user().currentRoom},
			{$set: {
				currentState: 1
				}
			});
	},

	// Enter state 2: Show money value on the clue screen
	clickClue: function(cat, clue, gameId) {
		if (Rooms.findOne({_id: gameId}).currentState != 1 || Rooms.findOne({_id: gameId}).activePlayer != this.userId)
			return;


		var activeClueWorth;


		switch (parseInt(clue)) {
			case 0:
				activeClueWorth = 400;
				break;
			case 1:
				activeClueWorth = 800;
				break;
			case 2:
				activeClueWorth = 1200;
				break;
			case 3:
				activeClueWorth = 1600;
				break;
			case 4:
				activeClueWorth = 2000;
				break;
			default:
				activeClueWorth = 0;
		}

		Rooms.update({_id: gameId},
			{$set: {
				currentState: 2,
				"activeClue.worth": activeClueWorth
			}
		});

		var query = "clues." + cat + "." + "clues." + clue +".selected";
		var setClue = {};
		setClue[query] = true;

		// Update the active clue to the one the user clicked on
		var activeClueQuestion = Rooms.findOne({_id: gameId}).clues[cat].clues[clue].question;
		var activeClueAnswer = Rooms.findOne({_id: gameId}).clues[cat].clues[clue].answer;
		



		Rooms.update({_id: gameId},
			{$set: setClue
		});

		// Enter state 3
		Meteor.setTimeout(function() {
			Rooms.update({_id: gameId},
				{$set: {
					currentState: 3,
					"activeClue.question": activeClueQuestion,
					"activeClue.answer": activeClueAnswer
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

	//Enter state 5
	buzzIn: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}) == null)
			return;
		Rooms.update({_id: Meteor.user().currentRoom},
			{$set: {
				currentState: 5,
				answeringPlayer: this.userId
			}
		});
	},

	// Check player's answer, if correct go back to state 1, else go to state 4 and disable incorrect player's ability to buzz in
	checkAnswer: function(answer) {

		if(Rooms.findOne({_id: Meteor.user().currentRoom}).currentPlayerAnswer != null)
			return;

		// Correct
		if(answer == Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.answer) {
			Rooms.update({_id: Meteor.user().currentRoom}, {
					$set:{
							currentPlayerAnswer: answer,
							currentAnswerCorrect: true,
							correctAnswer: Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.answer
					   	  }
				});	
		}

		// Incorrect
		else {
			Rooms.update({_id: Meteor.user().currentRoom}, {
					$set:{
							currentPlayerAnswer: answer,
							currentAnswerCorrect: false
					   	  }
				});	
		}

		Meteor._sleepForMs(2000);

		if(answer == Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.answer) {	// CORRECT
				console.log("correct!");
				var slot = Meteor.user().playerSlot;
				var q = "players." + slot + ".money";
				var updateMoney = {};
				updateMoney[q] = Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.worth;

				Rooms.update({_id: Meteor.user().currentRoom}, {
					$set: {
						currentState: 1,
						answeringPlayer: null,
						activePlayer: Meteor.user()._id,
						"activeClue.question": null,
						"activeClue.answer": null,
						"activeClue.worth": null,
						currentPlayerAnswer: null,
						currentAnswerCorrect: null,
						correctAnswer: null
					},
				 	$inc: updateMoney
				});
			}

			//incorrect
			else {	 			
				var incorrectCount = 0;
				var slot = Meteor.user().playerSlot;
				var qincorrect = "players." + slot + ".incorrect";
				var updateIncorrect = {};
				updateIncorrect[qincorrect] = true;

				var q = "players." + slot + ".money";
				var updateMoney = {};
				updateMoney[q] = Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.worth * -1;

				Rooms.update({_id: Meteor.user().currentRoom}, {
					$set: {
							currentState: 4,
							answeringPlayer: null,
							currentPlayerAnswer: null,
							currentAnswerCorrect: null,
							correctAnswer: null
					   	  }
				});

				Rooms.update({_id: Meteor.user().currentRoom}, {
					$inc: updateMoney
				});
				Rooms.update({_id: Meteor.user().currentRoom}, {
					$set: updateIncorrect
				});

				for (i = 0; i < Rooms.findOne({_id: Meteor.user().currentRoom}).players.length; i++) {
					if (Rooms.findOne({_id: Meteor.user().currentRoom}).players[i].incorrect) {
						incorrectCount++;
					}
				}
				if (incorrectCount == Rooms.findOne({_id: Meteor.user().currentRoom}).players.length) {

					Rooms.update({_id: Meteor.user().currentRoom}, {
					$set: {
						correctAnswer: Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.answer
					}
				});

					Meteor._sleepForMs(2000);

					Rooms.update({_id: Meteor.user().currentRoom}, {
					$set: {
						currentState: 1,
						answeringPlayer: null,
						"activeClue.question": null,
						"activeClue.answer": null,
						"activeClue.worth": null,
						currentPlayerAnswer: null,
						currentAnswerCorrect: null,
						correctAnswer: null
					}
				});


				for (i = 0; i < Rooms.findOne({_id: Meteor.user().currentRoom}).players.length; i++) {
						var qincorrect = "players." + i + ".incorrect";
						var updateIncorrect = {};
						updateIncorrect[qincorrect] = false;
						Rooms.update({_id: Meteor.user().currentRoom}, {
							$set: updateIncorrect
							});
					}	

				}
			}


			
		
	},

	toggleReady: function() {
		if (Meteor.user().currentRoom == null || Rooms.findOne({_id: Meteor.user().currentRoom}).currentState != 0) {
			return;
		}

		var playerNumber, readyStatus;
		for (i = 0; i < Rooms.findOne({_id: Meteor.user().currentRoom}).players.length; i++) {
			if (Rooms.findOne({_id: Meteor.user().currentRoom}).players[i].playerid == this.userId) {
				playerNumber = i;
				readyStatus = Rooms.findOne({_id: Meteor.user().currentRoom}).players[playerNumber].readyStatus;
			}
		}
		var query = "players." + playerNumber + ".readyStatus";
		var setReady = {};

		// Toggle player's ready status
		setReady[query] = readyStatus ? false : true;
		Rooms.update({_id: Meteor.user().currentRoom},
		 	{$set: setReady
		});
	},

	playerLeave: function() {
		if (Meteor.user().currentRoom == null) {
			return;
		}

		if (Meteor.userId() == Rooms.findOne({_id: Meteor.user().currentRoom}).ownerId){
			
			if (Rooms.findOne({_id: Meteor.user().currentRoom}).roomplayers > 1) {
				Rooms.update({_id: Meteor.user().currentRoom}, 
					{$set: {roomOwner: Rooms.findOne(Meteor.user().currentRoom).players[1].player,
							ownerId: Rooms.findOne(Meteor.user().currentRoom).players[1].playerid}});

			}
		}

		if (Meteor.userId() == Rooms.findOne({_id: Meteor.user().currentRoom}).activePlayer) {
			if (Rooms.findOne({_id: Meteor.user().currentRoom}).roomplayers > 1) {
				Rooms.update({_id: Meteor.user().currentRoom}, 
					{$set: {activePlayer: Rooms.findOne(Meteor.user().currentRoom).players[1].playerid}});

			}
		}

		if (Meteor.userId() == Rooms.findOne({_id: Meteor.user().currentRoom}).answeringPlayer) {
			if (Rooms.findOne({_id: Meteor.user().currentRoom}).roomplayers > 1) {
				Rooms.update({_id: Meteor.user().currentRoom}, {
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
		var p = Rooms.findOne({_id: Meteor.user().currentRoom}).roomplayers;
		var gameId = Meteor.user().currentRoom;
		var userId = this.userId;
		var slot = Meteor.user().playerSlot;

		for (i = slot+1; i < p; i++) {
			Meteor.users.update({_id: Rooms.findOne({_id: gameId}).players[i].playerid},
				{$inc: {playerSlot: -1}});
		}

		Rooms.update({_id: Meteor.user().currentRoom}, 
			{$pull: {players: {playerid: this.userId},
			 }
			});

		Rooms.update({_id: Meteor.user().currentRoom}, 
			{$inc: {roomplayers: -1}
			 }
			);
		
		Rooms.update({_id: Meteor.user().currentRoom}, 
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

	},

	roomCleanup: function() {
		var rooms = Rooms.find({roomplayers: 0});

		rooms.forEach(function(room) {
			Rooms.remove({_id: room._id});
		});
	},

	newGame: function() {

	}
});

/* states

0: pregame
1: player choosing a clue
2: money display, disable buttons, 2 seconds
3: clue display, 4 seconds
4: players buzzing in, 5 seconds
5: player answering, 5 seconds, back to state 1
6: checking answer
7: if all clues selected, end game
*/