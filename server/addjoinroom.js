
// Call to get an array of 6 random numbers that index clue categories for each game


function randomCategories() {
	var CATEGORIES_PER_GAME = 6;
	var randoms = [];

	var clueCount = Clues.find().count();
	for (var i = 0; i < CATEGORIES_PER_GAME; i++) {
		var rand = Math.floor(Math.random() * clueCount);
		while (_.contains(randoms, rand)) {
			rand = Math.floor(Math.random() * clueCount);
		}
		randoms.push(rand);
	}
	console.log(randoms);
	return randoms;
}


Meteor.methods({
	addRoom:function(roomName, roomPassword) {
		
		if (Meteor.user().currentRoom != null)
			return;

		var playerid = Meteor.userId();
		var roomOwner = Meteor.user().username;
	// Pull random clue categories from the db

		var randoms = randomCategories();

		var clueArray = [];
		var CATEGORIES_PER_GAME = 6;

		for (var i = 0; i < CATEGORIES_PER_GAME; i++) {
			var c = Clues.find().fetch()[randoms[i]];
			clueArray.push({
				category: c.category,
				comments: c.comments,
				clues: [{
					question: c.clues[0].question,
					answer: c.clues[0].answer,
					selected: false
				},
				{
					question: c.clues[1].question,
					answer: c.clues[1].answer,
					selected: false
				},
				{
					question: c.clues[2].question,
					answer: c.clues[2].answer,
					selected: false
				},
				{
					question: c.clues[3].question,
					answer: c.clues[3].answer,
					selected: false
				},
				{
					question: c.clues[4].question,
					answer: c.clues[4].answer,
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
			cluesDone: 0,

			players: [{
				player: roomOwner,
				money: 0,
				playerid: playerid,
				readyStatus: true,
				buzzInAbility: false,
				incorrect: false,
				isWinner: false
			}],

			// Category and clue indexes help check if a given answer is correct
			activeClue: {
				category: null,
				comments: null,
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

			correctAnswer: null,

			cluePickTimer: 5,
			clueActiveTimer: 6,
			buzzTimer: 30,

			clueActiveTimerIndex: null

		});


	// Set user's current room to newly created room id
		Meteor.users.update({_id: this.userId},
			{$set: {currentRoom: roomId,
					playerSlot: 0}});

		// var answerTimerHandle = Meteor.setInterval(function() {
		// 	if (Rooms.findOne({_id: roomId}).currentState == 5) {
		// 		Rooms.update({_id: roomId},
		// 			{$inc: {
		// 				answerTimer: -1
		// 				}
		// 			});
		// 	}
		// }, 1000);

		// var clueActiveHandle = Meteor.setInterval(function() {
		// 	if (Rooms.findOne({_id: roomId}).currentState == 4) {
		// 		Rooms.update({_id: roomId},
		// 			{$inc: {
		// 				clueActiveTimer: -1
		// 				}
		// 			});
		// 	}
		// }, 1000);

		// var answerTimerHandle = Meteor.setInterval(function() {
			
		// }, 1000);

		return roomId;
	},

	joinRoom: function(gameid, password) {

		if (Meteor.user().currentRoom != null)
			return;
		var roompass = Rooms.findOne({_id: gameid}).roomPassword;
		if (password != roompass)
			return false;

		var asdf = Rooms.update({_id: gameid},
			{$inc: {roomplayers: 1},
			 $push: {players: {
			 	player: Meteor.user().username,
			 	money: 0,
			 	playerid: Meteor.userId(),
			 	readyStatus: false,
			 	incorrect: false
			 }}});


		var players = Rooms.findOne({_id: gameid}).roomplayers - 1;

		Meteor.users.update({_id: this.userId},
			{$set: {currentRoom: gameid, playerSlot: players}});

		return true;

	},
	newGame: function() {

		var CATEGORIES_PER_GAME = 6;
		var randoms = randomCategories();
		var clueArray = [];

		for (var i = 0; i < CATEGORIES_PER_GAME; i++) {
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

		Rooms.update({_id: Meteor.user().currentRoom},{
			$set: {
				clues: clueArray,
				cluesDone: 0,


				// Category and clue indexes help check if a given answer is correct
				"activeClue.category": null,
				"activeClue.comments": null,
				"activeClue.question": null,
				"activeClue.answer": null,
				"activeClue.worth": null,

				answeringPlayer: null,

				currentState: 0,

				canBuzzIn: false,

				currentPlayerAnswer: null,

				currentAnswerCorrect: null,

				correctAnswer: null,

			}
		});

		for (var i=0; i < Rooms.findOne({_id: Meteor.user().currentRoom}).roomplayers; i++) {
			var a = {};
			var q1 = "players." + i + ".isWinner";
			a[q1] = false;
			var q2 = "players." + i + ".readyStatus";
			var q3= "players." + i + ".money";
			a[q3] = 0;
			if(i == 0)
				a[q2] = true;
			else
				a[q2] = false;
			Rooms.update({_id: Meteor.user().currentRoom}, 
			{$set: a
			 }
			);

		}
	}
});
