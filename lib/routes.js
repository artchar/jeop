
Router.route("/", {
	action: function() {
		this.render("home");

		this.render("footer", {to: "footer"});
		console.log("AAA");
	}
});

Router.route("/rooms", {

	action: function() {
		this.render("rooms");

		this.render("footer", {to: "footer"});

	},
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


		$('#contact').popover("toggle");

		$('#contact').popover("hide");

		var stateQuery = Rooms.find({_id: Meteor.user().currentRoom});
		observeHandle = stateQuery.observeChanges({
			changed: function(id, fields) {

				if (fields.currentState == 4) {
					Session.set("gamestate", 4);
					Session.set("activeTime", 6);
					h = Meteor.setInterval(function() {
						if (Session.equals("activeTime", 0) || Rooms.findOne({_id: Meteor.user().currentRoom}).currentState != 4)
						{
							Meteor.clearInterval(h);
						}
						else 
							Session.set("activeTime", Session.get("activeTime") -1);
					}, 1000);
					
				}
				else if(fields.currentState == 2) {
					Session.set("gamestate", 2);
					Session.set("lastactiveindex", fields.activeClue.index);

					Session.set("lastactivecategory", fields.activeClue.category);
				}
				else if (fields.currentState == 3) {
					Session.set("gamestate", 3);
					Session.set("buzzTime", 3000);
					j = Meteor.setInterval(function() {
						if (Session.equals("buzzTime"), 0) {
							Meteor.clearInterval(j);
						}
						else
							Session.set("buzzTime", Session.get("buzzTime") - 1);
					}, 1);
					Session.set("lastactivequestion", fields.activeClue.question);
				}
				else if (fields.currentState == 5) {
					Session.set("gamestate", 5);
					Meteor.clearInterval(j);
				}
				else if (fields.currentState == 0) {
					Session.set("gamestate", 0);
				}

				else if (fields.currentState == 1) {
					Session.set("gamestate", 1);
				}
				else if (fields.currentState == 2) {
					Session.set("gamestate", 2);
				}
				else if (fields.currentState == 6) {
					Session.set("gamestate", 6);
				}
				else if (fields.currentState == 7) {
					Session.set("gamestate", 7);
				}

				if(fields.currentPlayerAnswer != null){
					Session.set("lastanswer", fields.currentPlayerAnswer);
				}
			}
		});
				
			// 	if(fields.activeClue.index != null){
			// 		console.log(fields.activeClue.index);
					
			// 	}

			// 	if(fields.activeClue.question != null) {
			// 		console.log(fields.activeClue.question);
			// 		Session.set("lastactivequestion", fields.activeClue.question);
			// 	}
			// }
			


	},

	onStop: function() {
		Meteor.call("playerLeave");
	},

	subscriptions: function() {
		return Meteor.subscribe("currentRoom", this.params._id);
	}


});

// Hook prevents users from joining started games
Router.onBeforeAction(function() {
	if(Rooms.findOne({_id: this.params._id}).currentState != 0)
			Router.go("rooms");
	}, {
  	only: ["/rooms/:_id"]
});
