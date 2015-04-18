Meteor.methods({
	addRoom:function(ownerId, roomName, password) {
		var roomId = Rooms.insert({
			ownerId: ownerId,
			roomName: roomName,
			password: password
		});
	}
});