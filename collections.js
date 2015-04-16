Clues = new Mongo.Collection("clues");

if (Meteor.server) {
	Clues.insert({
		category: "GAMES",
		clues: [
			"the capital of dick mofuckaaaa",
			"shit boss bro",
			"stop",
			"sexxx",
			"hey"
		]
	});
	Clues.insert({
		category: "g",
		clues: [
			"the capital of dick mofuckaaaa",
			"shit boss bro",
			"stop",
			"sexxx",
			"hey"
		]
	}); 
	Clues.insert({
		category: "b",
		clues: [
			"the capital of dick mofuckaaaa",
			"shit boss bro",
			"stop",
			"sexxx",
			"hey"
		]
	}); 
	Clues.insert({
		category: "sdf",
		clues: [
			"the capital of dick mofuckaaaa",
			"shit boss bro",
			"stop",
			"sexxx",
			"hey"
		]
	}); 
	Clues.insert({
		category: "fee",
		clues: [
			"the capital of dick mofuckaaaa",
			"shit boss bro",
			"stop",
			"sexxx",
			"hey"
		]
	});
}