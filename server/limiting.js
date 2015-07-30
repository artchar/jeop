// var checkAnswerLimit = {
//     userId: function (userId) {
//         return Meteor.users.findOne(userId).type !== 'Admin';
//     },
//     type: 'method',
//     method: 'checkAnswer'
// }

// // Add the rule, allowing up to 1 call every 2 seconds
// DDPRateLimiter.addRule(checkAnswerLimit, 1, 2000);

// EasySecurity.config({
//   methods: {
//     joinRoom: { type: 'rateLimit', ms: 2000 },
//     checkAnswer: {type: 'rateLimit', ms: 2350}
//   },
//   ignoredMethods: ['playerCleanup', 'roomCleanup', 'ping', 'playerLeave', 'login', 'clickClue'],
//   maxQueueLength: 200
// });