Template.registerHelper("preGame", function() {

	if (Rooms.findOne({_id: Meteor.user().currentRoom}).currentState == 0)
		return true;
	else
		return false;
})


Template.registerHelper("isOwner", function() {
	if (Rooms.findOne({_id: Meteor.user().currentRoom}).ownerId == Template.currentData().playerid)
		return true;
	else
		return false;
})