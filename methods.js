Meteor.methods({
	addUser: function(nickname) {
		check(nickname, String);
		var userid = Users.insert({
			nickname: nickname
		});
		this.setUserId(userid);
		console.log(this.userId);
	}
});