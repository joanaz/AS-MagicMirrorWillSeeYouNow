'use strict';
/**
 * A Lambda function for handling Alexa Skill Magic Mirror Will See You Now requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Magic Mirror to see me now."
 *  Alexa: "Yes, how are you feeling today?"
 */

var Alexa = require('alexa-sdk');

/**
 * App ID for the skill
 * 
 * replace with your app ID 
 */
var APP_ID = "amzn1.ask.skill.4269b176-dc79-4023-914e-5ef8d09f6ed5";


// var completeLog = "My vision / hopes for the AI assistant / bot platforms of the future BOT: Hi how can I help you today? ME: I want to lose ten pounds. Setup my schedule to make it happen. BOT: Ok, but why do you want to lose ten pounds? ME: Because I look gross and need to lose weight. BOT: Ok, I can set up your schedule and diet to ensure you lose ten pounds within the next 30 days, but what will happen in the 30 days after? I suggest you rethink your request to optimize for wanting to live a healthier lifestyle. ME: Explain BOT: Well, we can regulate your intake of calories but when that regulation stops if you have not picked up the habits of choosing your own food, exercising, and managing your stress and sleep you will quickly bounce back to gaining weight and being unhappy. The weight is an affect of the lifestyle so to fix the weight fix the lifestyle and habits and the weight will adjust. ME: Ok Bot, setup my schedule to help me adjust to healthier lifestyle habits. BOT: Ok, starting a habit adjustment plan. The above conversation does not exist nor is it possible in any existing bot or AI platform regardless of all the glitter and buzz words entrepreneurs and big firms exhort to VCs and clients. The main reason? Inference. As people we rarely know what we want let alone understand why we want things. I don’t want my AI assistant / bot to just execute my commands blindly and automatically order me toilet paper once a month or spam colleagues with calendar invites until they fit an arbitrary log constraint chunk of my calendar. I want these systems to have my best interest in mind and be able to help me better understand myself as a person and actually improve my life beyond the material trinkets."


var STATES = {
    START: '_START_MODE', // Prompt the user to start or restart the therapy.
    QUESTION_ONE: '_QUESTION_ONE_MODE', // User is talking.
    QUESTION_TWO: '_QUESTION_TWO_MODE', // User is talking.
    QUESTION_THREE: '_QUESTION_THREE_MODE' // User is talking.  
};

var languageStrings = {
    "en-US": {
        "translation": {
            "WELCOME_MESSAGE": "Hello, I'm your virtual counselor. Shall we begin our journal therapy session?",
            "WELCOME_REPROMPT": "Hello, I'm your virtual counselor. I can perform journal therapy with you. If you wish to continue, say 'yes'. If you don't, say 'no' to end our session.",
            "WELCOME_CARD": "Hello",
            "HELP_MESSAGE": "Hello, I'm your virtual counselor. I can perform journal therapy with you. Journal therapy can be used to heal your emotional or physical problems or work through a trauma. I'll ask you three open ended questions for you to reflect on your mental wellbeing. Shall we begin our session?",
            "HELP_CARD": "Help",
            "STOP_MESSAGE": "See you next time!",
            "STOP_CARD": "Goodbye",
            "CONT_SESSION": "Hi, welcome back. Shall we continue our session?",
            "CONT_SESSION_REPROMPT": "Hi, welcome back. I'm your virtual counselor, we were conducting a journal therapy session, shall we continue? Say 'yes' to continue, say 'no' to end our session.",
            "CONT_SESSION_CARD": "Welcome back",
            "QUESTION_ONE": "How was your day?",
            "QUESTION_ONE_CARD": "Question 1",
            "HELP_MESSAGE_QUESTION_ONE": "TODO....",
            "QUESTION_TWO": "How was your sleep?",
            "QUESTION_TWO_CARD": "Question 2",
            "QUESTION_THREE": "How's your social life?",
            "QUESTION_THREE_CARD": "Question 3",
            "SESSION_END": "Thanks for sharing with me. See you next time!",
            "ANSWER_ERR": "Sorry, I didn't get that. ",
            "START_ERR": "Sorry, I didn't get that. If you wish to continue, say 'yes'. If you don't, say 'no' to end our session.",
            "ERROR_CARD": "Error"
        }
    }
};


// "How does that make you feel?",
// "Tell me more",
// "Can you elaborate on that please?",
// "Why do you feel like this",
// "Any change in eating habits?",
// "How's your social life?"
//


var newSessionHandlers = {
    // This will short-cut any incoming intent or launch requests and route them to this handler.
    'NewSession': function() {
        // Check if it's the first time the skill has been invoked
        console.log('new session!');

        let timestamp = new Date().toISOString();
        this.attributes['current'] = timestamp;
        this.handler.state = STATES.START;
        this.attributes[timestamp] = [];
        this.emit(':askWithCard', this.t("WELCOME_MESSAGE"), this.t("WELCOME_REPROMPT"), this.t("WELCOME_CARD"), this.t("WELCOME_REPROMPT"));
    },
    'HelloIntent': function() {
        this.emit('NewSession');
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':askWithCard', this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"), this.t("HELP_CARD"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function() {
        this.emit('StopSession');
    },
    'AMAZON.CancelIntent': function() {
        this.emit('StopSession');
    },
    'StopSession': function() {
        this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("STOP_CARD"), this.t("STOP_MESSAGE"));
    },
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        this.emit(':askWithCard', this.t("START_ERR"), this.t("START_ERR"), this.t("ERROR_CARD"), this.t("START_ERR"));
    }
};

var startModeHandlers = Alexa.CreateStateHandler(STATES.START, {
    'NewSession': function() {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'HelloIntent': function() {
        this.emit('NewSession');
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':askWithCard', this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"), this.t("HELP_CARD"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.YesIntent': function() {
        this.handler.state = STATES.QUESTION_ONE;
        this.emitWithState('AskQuestion');
    },
    'AMAZON.NoIntent': function() {
        this.emit('StopSession');
    },
    'AMAZON.StopIntent': function() {
        this.emit('StopSession');
    },
    'AMAZON.CancelIntent': function() {
        this.emit('StopSession');
    },
    // 'StopSession': function() {
    //     this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("STOP_CARD"), this.t("STOP_MESSAGE"));
    // },
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        this.emit(':askWithCard', this.t("START_ERR"), this.t("START_ERR"), this.t("ERROR_CARD"), this.t("START_ERR"));
    }
});

var questionOneHandlers = Alexa.CreateStateHandler(STATES.QUESTION_ONE, {
    'NewSession': function() {
        this.handler.state = this.attributes['STATE'];

        this.emit(':askWithCard', this.t("CONT_SESSION") + "Question 1. ", this.t("CONT_SESSION_REPROMPT"), this.t("CONT_SESSION_CARD"), this.t("CONT_SESSION_REPROMPT"));
    },
    'AskQuestion': function() {
        this.emit(':askWithCard', this.t("QUESTION_ONE"), this.t("QUESTION_ONE"), this.t("QUESTION_ONE_CARD"), this.t("QUESTION_ONE"));
    },
    'AMAZON.YesIntent': function() {
        this.emitWithState('AskQuestion');
    },
    'AMAZON.NoIntent': function() {
        this.emit('StopSession');
    },
    'AnswerIntent': function() {
        let answer = this.event.request.intent.slots.answer.value;
        if (answer) {
            this.attributes[this.attributes['current']].push(answer)
            this.handler.state = STATES.QUESTION_TWO;
            this.emitWithState('AskQuestion')
        } else {
            this.emit(':ask', this.t("ANSWER_ERR") + this.t("QUESTION_ONE"), this.t("ANSWER_ERR") + this.t("QUESTION_ONE"))
        }
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':askWithCard', this.t("HELP_MESSAGE_QUESTION_ONE"), this.t("HELP_MESSAGE"), this.t("HELP_CARD"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function() {
        this.emit('StopSession');
    },
    'AMAZON.CancelIntent': function() {
        this.emit('StopSession');
    },
    // 'StopSession': function() {
    //     this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("STOP_CARD"), this.t("STOP_MESSAGE"));
    // },
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        this.emit(':askWithCard', this.t("START_ERR"), this.t("START_ERR"), this.t("ERROR_CARD"), this.t("START_ERR"));
    }
});

var questionTwoHandlers = Alexa.CreateStateHandler(STATES.QUESTION_TWO, {
    'NewSession': function() {
        this.handler.state = this.attributes['STATE'];

        this.emit(':askWithCard', this.t("CONT_SESSION"), this.t("CONT_SESSION_REPROMPT"), this.t("CONT_SESSION_CARD"), this.t("CONT_SESSION_REPROMPT"));
    },
    'AskQuestion': function() {
        this.emit(':askWithCard', this.t("QUESTION_TWO"), this.t("QUESTION_TWO"), this.t("QUESTION_TWO_CARD"), this.t("QUESTION_TWO"));
    },
    'AMAZON.YesIntent': function() {
        this.emitWithState('AskQuestion');
    },
    'AMAZON.NoIntent': function() {
        this.emit('StopSession');
    },
    'AnswerIntent': function() {
        let answer = this.event.request.intent.slots.answer.value;
        if (answer) {
            this.attributes[this.attributes['current']].push(answer)
            this.handler.state = STATES.QUESTION_THREE;
            this.emitWithState('AskQuestion')
        } else {
            this.emit(':ask', this.t("ANSWER_ERR") + this.t("QUESTION_TWO"), this.t("ANSWER_ERR") + this.t("QUESTION_TWO"))
        }
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':askWithCard', this.t("HELP_MESSAGE_QUESTION_ONE"), this.t("HELP_MESSAGE"), this.t("HELP_CARD"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function() {
        this.emit('StopSession');
    },
    'AMAZON.CancelIntent': function() {
        this.emit('StopSession');
    },
    // 'StopSession': function() {
    //     this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("STOP_CARD"), this.t("STOP_MESSAGE"));
    // },
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        this.emit(':askWithCard', this.t("START_ERR"), this.t("START_ERR"), this.t("ERROR_CARD"), this.t("START_ERR"));
    }
});

var questionThreeHandlers = Alexa.CreateStateHandler(STATES.QUESTION_THREE, {
    'NewSession': function() {
        this.handler.state = this.attributes['STATE'];

        this.emit(':askWithCard', this.t("CONT_SESSION"), this.t("CONT_SESSION_REPROMPT"), this.t("CONT_SESSION_CARD"), this.t("CONT_SESSION_REPROMPT"));
    },
    'AMAZON.YesIntent': function() {
        this.emitWithState('AskQuestion');
    },
    'AskQuestion': function() {
        this.emit(':askWithCard', this.t("QUESTION_THREE"), this.t("QUESTION_THREE"), this.t("QUESTION_THREE_CARD"), this.t("QUESTION_THREE"))
    },
    'AMAZON.NoIntent': function() {
        this.emit('StopSession');
    },
    'AnswerIntent': function() {
        let answer = this.event.request.intent.slots.answer.value;
        if (answer) {
            this.attributes[this.attributes['current']].push(answer)
            this.handler.state = STATES.START;
            this.emit(':tellWithCard', this.t("SESSION_END"), this.t("STOP_CARD"), this.t("SESSION_END"));
        } else {
            this.emit(':ask', this.t("ANSWER_ERR") + this.t("QUESTION_THREE"), this.t("ANSWER_ERR") + this.t("QUESTION_THREE"));
        }
    },
    'AMAZON.HelpIntent': function() {
        this.emit(':askWithCard', this.t("HELP_MESSAGE_QUESTION_ONE"), this.t("HELP_MESSAGE"), this.t("HELP_CARD"), this.t("HELP_MESSAGE"));
    },
    'AMAZON.StopIntent': function() {
        this.emit('StopSession');
    },
    'AMAZON.CancelIntent': function() {
        this.emit('StopSession');
    },
    // 'StopSession': function() {
    //     this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("STOP_CARD"), this.t("STOP_MESSAGE"));
    // },
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true); // Be sure to call :saveState to persist your session attributes in DynamoDB
    },
    'Unhandled': function() {
        this.emit(':askWithCard', this.t("START_ERR"), this.t("START_ERR"), this.t("ERROR_CARD"), this.t("START_ERR"));
    }
});

exports.handler = function(event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.dynamoDBTableName = 'JournalLogs';
    alexa.registerHandlers(newSessionHandlers, startModeHandlers, questionOneHandlers, questionTwoHandlers, questionThreeHandlers);
    alexa.execute();
};