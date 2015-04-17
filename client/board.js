Template.board.onCreated( function() {

	var CATEGORY_COUNT = 5;
	var one = Math.floor(Math.random() * CATEGORY_COUNT);
	var two = Math.floor(Math.random() * CATEGORY_COUNT);
	var three = Math.floor(Math.random() * CATEGORY_COUNT);
	var four = Math.floor(Math.random() * CATEGORY_COUNT);
	var five = Math.floor(Math.random() * CATEGORY_COUNT);
	var six = Math.floor(Math.random() * CATEGORY_COUNT);


	Session.set("game_categories", {
		zero: {
			category: Clues.find().fetch()[one].category,
			clues: Clues.find().fetch()[one].clues
		},

		one: {
			category: Clues.find().fetch()[two].category,
			clues: Clues.find().fetch()[two].clues
		},
		two: {
			category: Clues.find().fetch()[three].category,
			clues: Clues.find().fetch()[three].clues
		},
		three: {
			category: Clues.find().fetch()[four].category,
			clues: Clues.find().fetch()[four].clues
		},
		four: {
			category: Clues.find().fetch()[five].category,
			clues: Clues.find().fetch()[five].clues
		},
		five: {
			category: Clues.find().fetch()[six].category,
			clues: Clues.find().fetch()[six].clues
		}

	});


});

Template.board.helpers({
	category: function(num) {
		var d = Math.floor(Math.random() * 5);
		if (typeof Clues != undefined) {
			return Clues.find().fetch()[d].category;
		}
		else return "Loading"

	},

})

Template.board.events({
	'click button': function(event) {
		var clue = event.target.id;
		var categorynumber = parseInt(clue[3]); // categorynumber
		var question = parseInt(clue[8]); // question

		switch (categorynumber) {
			case 0:
				categorynumber = "zero";
				break;
			case 1:
				categorynumber = "one";
				break;
			case 2:
				categorynumber = "two";
				break;
			case 3:
				categorynumber = "three";
				break;
			case 4:
				categorynumber = "four";
				break;
			case 5:
				categorynumber = "five";
				break;
		}

		console.log(categorynumber);

		Session.set("currentclue", {categorynumber: categorynumber, question: question});
	}
})