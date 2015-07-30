Meteor.methods({
	ping: function() {

		this.unblock();
		var now = new Date().getTime();
		Meteor.users.update({_id: Meteor.userId()},
			{$set: {lastPing: now}
		});
	}
});