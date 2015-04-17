Meteor.methods({
	addUser: function(nickname) {
		check(nickname, String);
	},

	test:function() {
	}
});