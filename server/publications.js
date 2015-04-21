Meteor.publish("rooms", function() {
	return Rooms.find({}, {
		fields: {
			roomPassword: false
		}
	});
})

Meteor.publish("clues", function() {
	return Clues.find();
})