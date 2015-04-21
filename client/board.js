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
		event.preventDefault();

	}
})

