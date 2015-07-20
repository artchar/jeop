Template.registerHelper("preGame", function() {

	if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 0 || Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 7)
		return true;
	else
		return false;
});


Template.registerHelper("isOwner", function() {
	if (Rooms.findOne({_id: Meteor.user().currentRoom}).ownerId == Template.currentData().playerid)
		return true;
	else
		return false;


});


Template.registerHelper("newGame", function() {
	if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 7)
		return true;
	else return false;
	}
);

Template.registerHelper("playerAnswering", function() {
	if (Rooms.findOne({_id: Meteor.user().currentRoom}).answeringPlayer == Meteor.userId())
		return "player-answering";
	else return "";
	}
);