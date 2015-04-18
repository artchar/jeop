Template.rooms.helpers({
	username: function() {
		if (Meteor.user() != null)
			return Meteor.user().username;
	},

	roomsList: function() {
		return Rooms.find();
	}
});