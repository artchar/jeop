Meteor.publish("rooms", function() {
	return Rooms.find({}, {
		fields: {
			roomPassword: false
		}
	});
})

Meteor.publish("currentRoom", function(id) {
	return Rooms.find({_id: id}, {
		fields: {
			clues: true
		}
	});
})