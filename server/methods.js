Meteor.methods({
	addUser: function(nickname) {
		check(nickname, String);
		// TODO: Detect users with the same nickname

		var user = {
			username: nickname,
			password: Meteor.uuid(),

		}
		Accounts.createUser(user, function(err) {
			if (err) {
				console.log("creationfailed!");
			}
			else 
			{
				console.log("success");
			}
		});
	},

	test:function() {

	}
});