Meteor.methods({
	addRoom:function(roomOwner, roomName, roomPassword) {
		var roomId = Rooms.insert({
			roomOwner: roomOwner,
			roomName: roomName,
			roomPassword: roomPassword
		});
	}
});