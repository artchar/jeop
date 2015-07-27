// var checkAnswerLimit = {
//     userId: function (userId) {
//         return Meteor.users.findOne(userId).type !== 'Admin';
//     },
//     type: 'method',
//     method: 'checkAnswer'
// }

// // Add the rule, allowing up to 1 call every 2 seconds
// DDPRateLimiter.addRule(checkAnswerLimit, 1, 2000);

EasySecurity.config({
  general: { type: 'rateLimit', ms: 1500 },
  methods: {
    joinRoom: { type: 'throttle', ms: 1000 },
    clickClue: { type: 'throttle', ms: 300 }
  },
  ignoredMethods: ['playerCleanup', 'roomCleanup', 'ping', 'playerLeave', 'login'],
  maxQueueLength: 200
});