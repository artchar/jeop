Template.categories.helpers({
	swag: function(){
		if (Session.get("hi"))
			return "selected";
		else
			return "";
	}
});

Template.categories.events({
	"click #h": function(event, template) {
		if (Session.get("hi"))
			Session.set("hi", false);
		else
			Session.set("hi", true);

		console.log("hei");
	}
});