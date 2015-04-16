Router.map(function() {
	this.route('game', {path: '/'});
});

if (Meteor.isClient) {
	Template.cluescreen.events({
		"click button": function (event, template) {
			event.preventDefault();
			var t = template.find("#answer").value;
			alert(t);
		}
	});
}