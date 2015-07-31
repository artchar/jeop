Router.route("home", {path: "/"});

Router.route("rooms", {path: "/rooms",
	waitOn: function() {
		return Meteor.subscribe("rooms");
	}
});



Router.route("/rooms/:_id", {

	action: function() {

		this.render("game");

		this.render("board", {
			to: "board",
			data: function() {
				if (Rooms.findOne({_id: this.params._id}).currentState != 0) {
					return {
						category0: Rooms.findOne({_id: this.params._id}).clues[0].category,
						category1: Rooms.findOne({_id: this.params._id}).clues[1].category,
						category2: Rooms.findOne({_id: this.params._id}).clues[2].category,
						category3: Rooms.findOne({_id: this.params._id}).clues[3].category,
						category4: Rooms.findOne({_id: this.params._id}).clues[4].category,
						category5: Rooms.findOne({_id: this.params._id}).clues[5].category
					};
				}

			}

		});

		this.render("cluescreen", {
			to: "cluescreen"
		});

		this.render("players", {
			to: "players", 
			data: function() {
				if (Rooms.findOne({_id: this.params._id})) {
					return {
						playerList: Rooms.findOne({_id: this.params._id}).players
					};
				}
				else
					return;
			}
		});

		this.render("footer", {
			to: "footer"
		});


	},

	onStop: function() {
		console.log("LEAVE");
		Meteor.call("playerLeave");
	},

	subscriptions: function() {
		return Meteor.subscribe("currentRoom", this.params._id);
	}


});

// Hook prevents users from joining started games
Router.onBeforeAction(function() {
	if(Rooms.findOne({_id: this.params._id}).currentState != 0)
			Router.go("home");
	}, {
  	only: ["/rooms/:_id"]
});
