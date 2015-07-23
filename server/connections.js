Meteor.methods({
	ping: function() {
		var now = new Date().getTime();
		Meteor.users.update({_id: Meteor.userId()},
			{$set: {lastPing: now}
		});
	}
});