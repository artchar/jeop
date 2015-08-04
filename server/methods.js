

function resetIncorrect(gameid, playerid) {


	for (var i = 0; i < Rooms.findOne({_id: gameid}).roomplayers; i++) {
		var qmoney = "players." + i + ".incorrect";
		var updateMoney = {};
		updateMoney[qmoney] = false;
		Rooms.update({_id: gameid}, {
			$set: updateMoney
		});
	}
}

function endGame(gameid, playerid) {
	var max = -999999;

	//var playerid = Meteor.userId();

	for ( var i = 0; i < Rooms.findOne({_id: gameid}).roomplayers; i++) {
		if (Rooms.findOne({_id: gameid}).players[i].money > max){
			max = Rooms.findOne({_id: gameid}).players[i].money;
		}
	}

	for (var i = 0; i < Rooms.findOne({_id: gameid}).roomplayers; i++) {
		if (Rooms.findOne({_id: gameid}).players[i].money == max) {
			var q = "players." + i + ".isWinner";
			var updateWin = {};		
			updateWin[q] = true;

		Rooms.update({_id: gameid}, {
			$set: updateWin
			});				
		}
	}

	Rooms.update({_id: gameid}, {
	$set: {
		currentState: 7,
		answeringPlayer: null,
		activePlayer: playerid,
		"activeClue.index": null,
		"activeClue.question": null,
		"activeClue.answer": null,
		"activeClue.worth": null,
		"activeClue.category": null,
		"activeClue.comments": null,
		currentPlayerAnswer: null,
		currentAnswerCorrect: null,
		correctAnswer: null
		}
	});
}



Meteor.methods({

	// Enter state 1: Current user can  select a clue
	startGame: function() {
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).ownerId != this.userId || Rooms.findOne({_id: Meteor.user().currentRoom}).currentState != 0) {
			return;
		}

		for (var i = 0; i < Rooms.findOne({_id: Meteor.user().currentRoom}).players.length; i++) {
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
	clickClue: function(cat, clue) {

		this.unblock();
		if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState != 1 || Rooms.findOne({_id: Meteor.user().currentRoom}).activePlayer != this.userId)
			return;

		var playerid = Meteor.userId();
		var activeClueWorth;

		var gameid = Meteor.user().currentRoom;
		var room = Rooms.findOne({_id: gameid});

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

		var activeClueCategory = Rooms.findOne({_id: gameid}).clues[cat].category;
		var activeClueComments = Rooms.findOne({_id: gameid}).clues[cat].comments;
		var activeClueIndex = Rooms.findOne({_id: gameid}).clues[cat].index;

		Rooms.update({_id: Meteor.user().currentRoom},
			{$set: {
				currentState: 2,
				"activeClue.index": activeClueIndex,
				"activeClue.worth": activeClueWorth,
				"activeClue.category": activeClueCategory,
				"activeClue.comments": activeClueComments
			}
		}, function() {

		catidx = Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.index;
		activeq = Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.question;
		userAnswer = Rooms.findOne({_id: Meteor.user().currentRoom}).currentPlayerAnswer;
			});


		var query = "clues." + cat + "." + "clues." + clue +".selected";
		var setClue = {};
		setClue[query] = true;

		// Update the active clue to the one the user clicked on
		var activeClueQuestion = Rooms.findOne({_id: Meteor.user().currentRoom}).clues[cat].clues[clue].question;
		var activeClueAnswer = Rooms.findOne({_id: Meteor.user().currentRoom}).clues[cat].clues[clue].answer;
		



		Rooms.update({_id: Meteor.user().currentRoom},
			{$set: setClue
		});

		// Enter state 3, clue display
		Meteor.setTimeout(function() {
			Rooms.update({_id: gameid},
				{$set: {
					currentState: 3,
					"activeClue.question": activeClueQuestion,
					"activeClue.answer": activeClueAnswer
				}
			});

		}, 4000);


		
		// Enter state 4, players can buzz in
		Meteor.setTimeout(function() {
			Rooms.update({_id: gameid},
				{$set: {
					currentState: 4
				}
			});
		}, 7000);

		// In 6 seconds, no one buzzes in


		timerIndex = Meteor.setTimeout(function() {
			if (Rooms.findOne({_id: gameid}).currentState != 4){
				return;
			}

			Rooms.update({_id: gameid}, {
				$set:{
						currentState: 6,
						correctAnswer: Rooms.findOne({_id: gameid}).activeClue.answer[0],
						currentAnswerCorrect: null
				   	  }
			}, function() {
				Meteor.sleep(2800);
				Rooms.update({_id: gameid}, {
						$set:{
								currentState: 5,
								correctAnswer: Rooms.findOne({_id: gameid}).activeClue.answer[0],
								currentAnswerCorrect: null
						   	  }
					}, function() {
						Rooms.update({_id: gameid},
						{	
							$set: {
								currentState: 1,
								answeringPlayer: null,
								activePlayer: playerid,
								"activeClue.index": null,
								"activeClue.question": null,
								"activeClue.answer": null,
								"activeClue.worth": null,
								"activeClue.category": null,
								"activeClue.comments": null,
								currentPlayerAnswer: null,
								currentAnswerCorrect: null,
								correctAnswer: null,
								clueActiveTimer: 8
							},

							$inc: {
								cluesDone: 1
							}
						}, function() {
								if (Rooms.findOne({_id: gameid}).cluesDone == 30) {
									endGame(gameid, playerid);

									for (var i = 0; i < room.roomplayers; i++) {
											var qmoney = "players." + i + ".incorrect";
											var updateMoney = {};
											updateMoney[qmoney] = 0;
											Rooms.update({_id: gameid}, {
												$set: updateMoney
											});
										}
							}
						});
				});	
			});
		
		}, 13000);

	},

	//Enter state 5
	buzzIn: function() {

		// Meteor.clearInterval(answerTimerHandle);
		// Meteor.clearInterval(clueActiveHandle);
		// Meteor.clearInterval(buzzTimerHandle);

		var gameid = Meteor.user().currentRoom;

		var activeTime = Rooms.findOne({_id: gameid}).clueActiveTimer;
		if (Rooms.findOne({_id: Meteor.user().currentRoom}) == null || Rooms.findOne({_id: gameid}).currentState !=4 )
			return false;

	//	console.log(Rooms.findOne({_id: gameid}).clueActiveTimerIndex);
	//	console.log(Timers.gameid);
	//	Meteor.clearTimeout(Timers.gameid);

		Rooms.update({_id: Meteor.user().currentRoom},
			{$set: {
				currentState: 5,
				answeringPlayer: this.userId
			}
		});

		return true;
	},

	spellCheck: function(answer) {
		this.unblock();
		var gameid = Meteor.user().currentRoom;
		var playerid = Meteor.userId();
		var correct = false;
		var realAnswers = Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.answer;

		

		var regex = /['\s"!@ #$%^&*()\/\\\-_,.;]/g;
		var regex2 = /and/gi;
		var cleanedAnswer = answer.replace(regex, "");
		cleanedAnswer = cleanedAnswer.replace(regex2, "");
		cleanedAnswer = cleanedAnswer.toLowerCase();
		var realAnswers = Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.answer;

		for (i = 0; i < realAnswers.length; i++) {
			realAnswers[i] = realAnswers[i].replace(regex, "");
			realAnswers[i] = realAnswers[i].toLowerCase();
		}


		if (_.contains(realAnswers, cleanedAnswer))
			return true;
		else {
			console.log("GETted!");
			var k = "0zDUgX3pZHGBRLK9B9KwPhS52ugr4LpeGw7Fk0lt01s";
			var url = "https://api.datamarket.azure.com/Bing/Search/v1/SpellingSuggestions?Query=%27" + answer + "%27&$format=JSON";
			var s = HTTP.call("GET", url, {auth: k + ":" + k});
			if (s.data.d.results[0].Value == undefined)
				return false;
			var spellCheckedAnswer = s.data.d.results[0].Value;
			spellCheckedAnswer = spellCheckedAnswer.replace(regex, "");
			spellCheckedAnswer = spellCheckedAnswer.replace(regex2, "");
			spellCheckedAnswer = spellCheckedAnswer.toLowerCase();
			console.log(spellCheckedAnswer);
			if (_.contains(realAnswers, spellCheckedAnswer)) {
				return true;
			}
			else
				return false;
		}

	},

	// Check player's answer, if correct go back to state 1, else go to state 4 and disable incorrect player's ability to buzz in
	checkAnswer: function(correct, answer) {
		this.unblock();
		var gameid = Meteor.user().currentRoom;
		var playerid = Meteor.userId();

		if(Rooms.findOne({_id: gameid}).currentPlayerAnswer != null)
			return;


		// Correct
		if(correct) {
			//correct = true;
			Rooms.update({_id: gameid}, {
					$set:{
							currentState: 6,
							currentPlayerAnswer: answer,
							currentAnswerCorrect: true,
							correctAnswer: Rooms.findOne({_id: gameid}).activeClue.answer[0]
					   	  },
					$inc:{
							cluesDone: 1
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

		Meteor.sleep(3000);

		if(correct) {	// CORRECT
				var slot = Meteor.user().playerSlot;
				var q = "players." + slot + ".money";
				var updateMoney = {};
				updateMoney[q] = Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.worth;

				Rooms.update({_id: Meteor.user().currentRoom}, {
					$set: {
						currentState: 1,
						answeringPlayer: null,
						activePlayer: Meteor.user()._id,
						"activeClue.index": null,
						"activeClue.question": null,
						"activeClue.answer": null,
						"activeClue.worth": null,
						"activeClue.category": null,
						"activeClue.comments": null,
						currentPlayerAnswer: null,
						currentAnswerCorrect: null,
						correctAnswer: null,
						clueActiveTimer: 8
					},
				 	$inc: updateMoney
				}, function() {
					resetIncorrect(gameid, playerid);
					if (Rooms.findOne({_id: Meteor.user().currentRoom}).cluesDone == 30) {
						Meteor.sleep(1000);
						endGame(gameid, playerid);
					}

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
				$inc: updateMoney,
				$set: updateIncorrect
			});

			for (var i = 0; i < Rooms.findOne({_id: Meteor.user().currentRoom}).players.length; i++) {
				if (Rooms.findOne({_id: Meteor.user().currentRoom}).players[i].incorrect) {
					incorrectCount++;
				}
			}

			if (incorrectCount == Rooms.findOne({_id: Meteor.user().currentRoom}).players.length) {

				Rooms.update({_id: Meteor.user().currentRoom}, {
					$set: {
						currentState: 6,
						correctAnswer: Rooms.findOne({_id: Meteor.user().currentRoom}).activeClue.answer[0]
						},
					$inc: {cluesDone: 1}
				});

				Meteor.sleep(3400);

				Rooms.update({_id: Meteor.user().currentRoom}, {
				$set: {
					currentState: 1,
					answeringPlayer: null,
					"activeClue.index": null,
					"activeClue.question": null,
					"activeClue.answer": null,
					"activeClue.worth": null,
					"activeClue.category": null,
					"activeClue.comments": null,
					currentPlayerAnswer: null,
					currentAnswerCorrect: null,
					correctAnswer: null,
					clueActiveTimer: 8
					}
				});


				resetIncorrect(gameid, playerid);


				if (Rooms.findOne({_id: Meteor.user().currentRoom}).cluesDone == 30) {
					Meteor.sleep(1000);
				
					endGame(gameid, playerid);
				}
			}

		}

		if (incorrectCount != Rooms.findOne({_id: Meteor.user().currentRoom}).players.length && !correct) {
			clueActiveHandle = Meteor.setTimeout(function() {

				if (Rooms.findOne({_id: gameid}).currentState != 4) {
					return;
				}

					Rooms.update({_id: gameid}, {
						$set:{
								currentState: 6,
								correctAnswer: Rooms.findOne({_id: gameid}).activeClue.answer[0],
								currentAnswerCorrect: false
						   	  }
					});	

					Meteor.setTimeout(function() {
						Rooms.update({_id: gameid},
						{	$set: {
							currentState: 1,
							answeringPlayer: null,
							//activePlayer: playerid,
							"activeClue.index": null,
							"activeClue.question": null,
							"activeClue.answer": null,
							"activeClue.worth": null,
							"activeClue.category": null,
							"activeClue.comments": null,
							currentPlayerAnswer: null,
							currentAnswerCorrect: null,
							correctAnswer: null,
							clueActiveTimer: 8
							},

							$inc: {
							cluesDone: 1
							}
						});

						for (i = 0; i < Rooms.findOne({_id: gameid}).players.length; i++) {
							var qincorrect = "players." + i + ".incorrect";
							var updateIncorrect = {};
							updateIncorrect[qincorrect] = false;
							Rooms.update({_id: gameid}, {
								$set: updateIncorrect
								});
						}	
					}, 1000);
					
					Meteor.setTimeout(function() {
						if (Rooms.findOne({_id: gameid}).cluesDone == 30) {
						Rooms.update({_id: gameid}, {
							$set: {
								currentState: 7,
								answeringPlayer: null,
				//				activePlayer: playerid,
								"activeClue.index": null,
								"activeClue.question": null,
								"activeClue.answer": null,
								"activeClue.worth": null,
								"activeClue.category": null,
								"activeClue.comments": null,
								currentPlayerAnswer: null,
								currentAnswerCorrect: null,
								correctAnswer: null
							}
						});

						var max = -999999;
						for (var i = 0; i < Rooms.findOne({_id: gameid}).roomplayers; i++) {
							if (Rooms.findOne({_id: gameid}).players[i].money > max){
								max = Rooms.findOne({_id: gameid}).players[i].money;
							}
						}

						for (var i = 0; i < Rooms.findOne({_id: gameid}).roomplayers; i++) {
							if (Rooms.findOne({_id: gameid}).players[i].money == max) {
								var q = "players." + i + ".isWinner";
								var updateWin = {};		
								updateWin[q] = true;

						Rooms.update({_id: gameid}, {
							$set: updateWin
							});				
						}
					}

						for (var i = 0; i < Rooms.findOne({_id: gameid}).roomplayers; i++) {
								var qmoney = "players." + i + ".incorrect";
								var updateMoney = {};
								updateMoney[qmoney] = 0;
								Rooms.update({_id: gameid}, {
									$set: updateMoney
								});
							}
					}}, 2300);
				}, 6000);
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
		if (Meteor.user() == null || Rooms.findOne({_id: Meteor.user().currentRoom}) == undefined || Meteor.user().currentRoom == null) {
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

		for (var i = slot+1; i < p; i++) {
			Meteor.users.update({_id: Rooms.findOne({_id: gameId}).players[i].playerid},
				{$inc: {playerSlot: -1}});
		}

		Rooms.update({_id: Meteor.user().currentRoom}, 
			{$pull: {players: {playerid: this.userId},
			 }
			});

		Rooms.update({_id: Meteor.user().currentRoom}, 
			{$inc: {roomplayers: -1}
			 }, function() {
			 	Meteor.users.update({_id: userId},
					{$set: {currentRoom: null, playerSlot: null}
				});
			 }
			);
		
		Rooms.update({_id: Meteor.user().currentRoom}, 
			{$set: setReady
			 }
			);
		// var handle2 = Meteor.setInterval(function() {
		// 	if (Rooms.findOne({_id: gameId}).roomplayers != p) {

		// 		Meteor.users.update({_id: userId},
		// 			{$set: {currentRoom: null, playerSlot: null}
		// 		});
		// 		Meteor.clearInterval(handle2);
		// 	}
		// 	else{
		// 		return;
		// 	}
		// }, 5);

	},

	roomCleanup: function() {
		var rooms = Rooms.find({roomplayers: {$lte: 0}});

		rooms.forEach(function(room) {
			Rooms.remove({_id: room._id});
		});
	},


	playerCleanup: function() {
		this.unblock();
		var now = new Date().getTime();
		var diff = now - 10000;
		var players = Meteor.users.find({lastPing: {$lte: diff}});
		players.forEach(function (player) {
			console.log(player.username);

			var room = player.currentRoom;
			var gameId = room;
			var userId = player._id;

			if (player.currentRoom != null && Rooms.findOne({_id: room})) {
				// if (Rooms.findOne({_id: room}) == undefined)
				// 	return;
				console.log('hi');
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
			var slot = player.playerSlot;

			for (var i = slot+1; i < p; i++) {
				Meteor.users.update({_id: Rooms.findOne({_id: gameId}).players[i].playerid},
					{$inc: {playerSlot: -1}});
			}

			Rooms.update({_id: room}, 
				{$pull: {players: {playerid: userId},
				 }
				});

			Rooms.update({_id: room}, 
				{$inc: {roomplayers: -1}
				 }, function() {
				 	Meteor.users.update({_id: userId}, {currentRoom: null, playerSlot: null, lastPing: 3000});
				 }
				);
			
			Rooms.update({_id: room}, 
				{$set: setReady
				 }
				);
			}

			else {
				Meteor.users.remove({_id: userId});
			}

		
		});
	},

	reportClue: function(catindx, q, userAnswer, cat) {
		var now = new Date();
		Reports.insert({
			date: now, 
			catIndex: catindx,
			q: q,
			userAnswer: userAnswer,
			category: cat
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
6: checking answer
7: if all clues selected, end game
*/

