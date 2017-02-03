'use strict';
/**
 * A Lambda function for handling Alexa Skill Magic Mirror Will See You Now requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Magic Mirror to see me now."
 *  Alexa: "Yes my Queen, how are you feeling today?"
 */

var Alexa = require('alexa-sdk');

/**
 * App ID for the skill
 * 
 * replace with your app ID 
 */
var APP_ID = "amzn1.ask.skill.4269b176-dc79-4023-914e-5ef8d09f6ed5";

var AWSIoT = require('./AWSIoT');
AWSIoT.setup();

var completeLog = ''

exports.handler = function(event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var languageStrings = {
    "en-US": {
        "translation": {
            "CARD_TITLE": "MagicMirror: %s",
            "HELP_MESSAGE": "Hello Your Majesty, I'm your virtual counselor Eugenie. I can perform journal therapy with you. Journal therapy can be used to heal your emotional or physical problems or work through a trauma. It focuses on your internal experiences, thoughts and feelings. Let's begin our session. Are there anything you want to share with me today?",
            "WELCOME_MESSAGE": "Hello Your Majesty, I'm your virtual counselor Eugenie. Let's begin our journal therapy session. Are there anything you want to share with me today?",
            "WELCOME_REPROMPT": "Hello Your Majesty, I'm your virtual counselor Eugenie. I can perform journal therapy with you. If you want to confide in me, just say 'yes' and keep talking to me, I'll be listening. If you don't wish to continue, say 'no' to end our session. Are there anything you want to share with me today?",
            "STOP_MESSAGE": "See you next time, Your Majesty!",
            "CONT_LOG": "I see. Are there anything else you want to share with me me?",
            "CONT_LOG_REPROMPT": "If you want to continue our session, say 'yes' and keep talking. If not, say 'no' to end our session. Are there anything else you want to share with me?",
            "CONT_LOG_ERR": "Sorry, I didn't get that. If you want to continue our session, say 'yes' and tell me your story. If not, say 'no' to end our session. Are there anything you want to share with me?",
            "END_LOG": "Thanks for sharing with me. See you next time, Your Majesty!"
        }
    }
};

var handlers = {
    'LaunchRequest': function() {
        this.emit('HelpPrompt');
    },
    'AMAZON.HelpIntent': function() {
        this.emit('HelpPrompt');
    },
    'HelpPrompt': function() {
        this.emit(':askWithCard', this.t("HELP_MESSAGE"), this.t("HELP_MESSAGE"), this.t("CARD_TITLE", "Help"), this.t("HELP_MESSAGE"));
    },
    'HelloIntent': function() {
        this.emit(':askWithCard', this.t("WELCOME_MESSAGE"), this.t("WELCOME_REPROMPT"), this.t("CARD_TITLE", "Hello"), this.t("WELCOME_REPROMPT"));
    },
    'AMAZON.StopIntent': function() {
        this.emit(':StopSession');
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':StopSession');
    },
    'StopSession': function() {
        this.emit(':tellWithCard', this.t("STOP_MESSAGE"), this.t("CARD_TITLE", "Stop"), this.t("STOP_MESSAGE"));
    },
    'YesIntent': function() {
        let text = this.event.request.intent.slots.text.value;
        if (text) {
            completeLog += text

            this.emit(':askWithCard', this.t("CONT_LOG"), this.t("CONT_LOG_REPROMPT"), this.t("CARD_TITLE", "Log"), this.t("CONT_LOG_REPROMPT"))
        } else {
            this.emit(':askWithCard', this.t("CONT_LOG_ERR"), this.t("CONT_LOG_ERR"), this.t("CARD_TITLE", "Log:Error"), this.t("CONT_LOG_ERR"))
        }
    },
    'NoIntent': function() {
        var completeLog = "My vision / hopes for the AI assistant / bot platforms of the future BOT: Hi how can I help you today? ME: I want to lose ten pounds. Setup my schedule to make it happen. BOT: Ok, but why do you want to lose ten pounds? ME: Because I look gross and need to lose weight. BOT: Ok, I can set up your schedule and diet to ensure you lose ten pounds within the next 30 days, but what will happen in the 30 days after? I suggest you rethink your request to optimize for wanting to live a healthier lifestyle. ME: Explain BOT: Well, we can regulate your intake of calories but when that regulation stops if you have not picked up the habits of choosing your own food, exercising, and managing your stress and sleep you will quickly bounce back to gaining weight and being unhappy. The weight is an affect of the lifestyle so to fix the weight fix the lifestyle and habits and the weight will adjust. ME: Ok Bot, setup my schedule to help me adjust to healthier lifestyle habits. BOT: Ok, starting a habit adjustment plan. The above conversation does not exist nor is it possible in any existing bot or AI platform regardless of all the glitter and buzz words entrepreneurs and big firms exhort to VCs and clients. The main reason? Inference. As people we rarely know what we want let alone understand why we want things. I don’t want my AI assistant / bot to just execute my commands blindly and automatically order me toilet paper once a month or spam colleagues with calendar invites until they fit an arbitrary log constraint chunk of my calendar. I want these systems to have my best interest in mind and be able to help me better understand myself as a person and actually improve my life beyond the material trinkets."

        if (completeLog) {
            let alexa = this
            let alexaEmit = function() {
                alexa.emit(':tellWithCard', alexa.t("END_LOG"), alexa.t("CARD_TITLE", "EndLog"), alexa.t("END_LOG"))
            }

            // Send publish attempt to AWS IoT
            AWSIoT.newLog(completeLog, alexaEmit);
        } else {
            this.emit(':tellWithCard', this.t("END_LOG"), this.t("CARD_TITLE", "EndLog"), this.t("END_LOG"))
        }
    }
};