Router.route("home", {path: "/"});

Router.route("rooms", {path: "/rooms"});

Router.route("/rooms/:_id", function() {

	

	this.render("game");

	this.render("board", {
		to: "board",
		data: function() {

			return {
				category0: Rooms.findOne({_id: this.params._id}).clues[0].category,
				category1: Rooms.findOne({_id: this.params._id}).clues[1].category,
				category2: Rooms.findOne({_id: this.params._id}).clues[2].category,
				category3: Rooms.findOne({_id: this.params._id}).clues[3].category,
				category4: Rooms.findOne({_id: this.params._id}).clues[4].category,
				category5: Rooms.findOne({_id: this.params._id}).clues[5].category
			};
		}
	});

	this.render("cluescreen", {
		to: "cluescreen"
	});

	this.render("players", {
		to: "players", 
		data: function() {
			return {
				playerList: Rooms.findOne({_id: this.params._id}).players
			};
		}
	})


}); 