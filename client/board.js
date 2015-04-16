Template.board.onCreated(function() {
	Session.setDefault("cat1", null);
	Session.setDefault("cat2", null);
	Session.setDefault("cat3", null);
	Session.setDefault("cat4", null);
	Session.setDefault("cat5", null);
	Session.setDefault("cat6", null);

})
Template.board.helpers({
	category: function(num) {
		if (!Session.equals("cat1", null) && !Session.equals("cat2", null) &&
			   !Session.equals("cat3", null) && !Session.equals("cat4", null) &&
			   !Session.equals("cat6", null) && !Session.equals("cat5", null)) {
			return Clues.find().fetch()[Session.get("cat" + num)].category;
		}
		var random = Math.floor(Math.random() * (Clues.find().count()));
		console.log(random);
		while (Session.equals("cat1", random) || Session.equals("cat2", random) ||
			   Session.equals("cat3", random) || Session.equals("cat4", random) ||
			   Session.equals("cat6", random) || Session.equals("cat5", random)) {

			random = Math.floor(Math.random() * (Clues.find().count()));
			console.log(random);

		}
		Session.set("cat" + num, random);
		return Clues.find().fetch()[Session.get("cat" + num)].category;
	}
})