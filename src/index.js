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


var STATES = {
    START_MODE: '_START_MODE', // Prompt the user to start or restart the therapy.
    ASK_MODE: '_ASK_MODE' // User is talking.
};

var languageStrings = {
    "en-US": {
        "translation": {
            "WELCOME_MESSAGE": "Hello! I'm your virtual counselor. Shall we begin our journal therapy session?",
            "WELCOME_CARD": "Hello",
            "HELP_MESSAGE": "Hello! I'm your virtual counselor. I can perform journal therapy with you. Journal therapy can be used to heal your emotional or physical problems or work through a trauma. I'll ask you some open ended questions for you to reflect on yourself. You can pause our session at any moment by saying 'stop', and come back to me later. You can also start over your answer by saying 'start over'. Shall we begin our session? Say 'yes' to continue, say 'no' to end our session.",
            "HELP_CARD": "Help",
            "STOP_MESSAGE": "See you next time!",
            "STOP_CARD": "Goodbye",
            "CONT_SESSION": "Hi! Welcome back! Shall we continue our session?",
            "CONT_SESSION_REPROMPT": "Hi! Welcome back! I'm your virtual counselor. We were having a journal therapy session. Shall we continue? Say 'yes' to continue, say 'no' to end our session.",
            "CONT_SESSION_CARD": "Welcome back",
            "QUESTIONS": [
                "How was your day?",
                "Tell me more",
                "How was your sleep?",
                "Why do you feel like this",
                "How's your social life?"
            ],
            "SESSION_END": "Thanks for sharing with me. See you next time!",
            "ANSWER_ERR": "Sorry, I didn't get that. ",
            "START_ERR": "Sorry, I didn't get that. Say 'yes' to continue, say 'no' to end our session.",
            "ERROR_CARD": "Error"
        }
    }
};

var newSessionHandlers = {
    // This will short-cut any incoming intent or launch requests and route them to this handler.
    'NewSession': function() {
        // Check if it's the first time the skill has been invoked
        console.log('new session!');

        let timestamp = new Date().toISOString();
        this.attributes['current'] = timestamp;
        this.handler.state = STATES.START_MODE;
        this.attributes[timestamp] = [];
        this.emit(':askWithCard', this.t("WELCOME_MESSAGE"), this.t("HELP_MESSAGE"), this.t("WELCOME_CARD"), this.t("HELP_MESSAGE"));
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

var startModeHandlers = Alexa.CreateStateHandler(STATES.START_MODE, {
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
        this.handler.state = STATES.ASK_MODE;
        this.attributes["question"] = 0
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
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
    },
    'Unhandled': function() {
        this.emit(':askWithCard', this.t("START_ERR"), this.t("START_ERR"), this.t("ERROR_CARD"), this.t("START_ERR"));
    }
});

var askModeHandlers = Alexa.CreateStateHandler(STATES.ASK_MODE, {
    'NewSession': function() {
        this.handler.state = this.attributes['STATE'];
        this.emit(':askWithCard', this.t("CONT_SESSION"), this.t("CONT_SESSION_REPROMPT"), this.t("CONT_SESSION_CARD"), this.t("CONT_SESSION_REPROMPT"));
    },
    'AskQuestion': function(answer) {
        let index = this.attributes["question"]
        let cardText = '\n'
        if (index > 0 && answer)
            cardText = "Your answer to the last question\n" + this.t("QUESTIONS")[index - 1] + "\n" + answer

        this.emit(':askWithCard', this.t("QUESTIONS")[index], this.t("QUESTIONS")[index], this.t("QUESTIONS")[index], cardText);
    },
    'AMAZON.StartOverIntent': function() {
        this.emitWithState('AskQuestion');
    },
    'AMAZON.YesIntent': function() {
        this.emitWithState('AskQuestion');
    },
    'AMAZON.NoIntent': function() {
        this.emit('StopSession');
    },
    'AnswerIntent': function() {
        let answer = this.event.request.intent.slots.answer.value;
        let index = this.attributes["question"]
        if (answer) {
            this.attributes[this.attributes['current']].push(answer)
            index++;

            if (index < this.t("QUESTIONS").length) {
                this.attributes["question"] = index
                this.emitWithState('AskQuestion', answer)
            } else {
                this.attributes["question"] = 0
                this.handler.state = STATES.START_MODE;

                let cardText = this.t("SESSION_END") + "\n" + "You answer to the last question\n" + this.t("QUESTIONS")[index - 1] + "\n" + answer

                this.emit(':tellWithCard', this.t("SESSION_END"), this.t("STOP_CARD"), cardText);
            }
        } else {
            this.emit(':ask', this.t("ANSWER_ERR") + this.t("QUESTIONS")[index], this.t("ANSWER_ERR") + this.t("QUESTIONS")[index])
        }
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
    'SessionEndedRequest': function() {
        console.log('session ended!');
        this.emit(':saveState', true);
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
    alexa.registerHandlers(newSessionHandlers, startModeHandlers, askModeHandlers);
    alexa.execute();
};