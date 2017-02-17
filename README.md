# Magic Mirror Will See You Now Alexa Skill
An [AWS Lambda](http://aws.amazon.com/lambda) function of an Alexa skill for virtual counseling / journal therapy. It also sends your journal log to a [MagicMirror](https://github.com/MichMich/MagicMirror) using AWS IoT Device Gateway, and having it analyse and display your personality, tone and sentiment. 

It is complementary to the Magic Mirror Module [Magic Mirror Will See You Now]().


## Dependencies

- [alexa-sdk](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) (installed via `npm install`)


## Setup

To run this skill you need to do two things:

1. deploy the code in Lambda
2. configure the Alexa skill to use Lambda

### AWS Lambda Setup

1. Go to the AWS Console and click on the __Lambda__ link. Note: ensure you are in __us-east__ or you won't be able to use Alexa with Lambda.
2. Click on the __Create a Lambda Function__ or __Get Started Now__ button.
3. Choose __Blank Blueprint__
4. Choose trigger __Alexa Skills Kit__, click "Next"
5. Name the Lambda Function, select the runtime as __Node.js__
6. Go to the __src__ directory, select all files and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
7. Select __Code entry type__ as "Upload a .ZIP file" and then upload the .zip file to the Lambda
8. Keep the Handler as index.handler (this refers to the main js file in the zip).
9. __Create new role from template__ and name it.
10. Leave the Advanced settings as the defaults.
11. Click "Next" and review the settings then click "Create Function"
12. Copy the __ARN__ from the top right to be used later in the Alexa Skill Setup

### Alexa Skill Setup

1. Go to the [Alexa Console](https://developer.amazon.com/edw/home.html) and click __Add a New Skill__.
2. Set "Mirror Mirror On The Wall" as the skill name and "on the wall" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, on the wall, say hello". If you customized the wake word as "Mirror mirror", you can say "Mirror mirror on the wall, find Snow White".
3. Select the __Lambda ARN__ for the skill Endpoint and paste the ARN copied from above. Click Next.
4. Copy the __Intent Schema__ from the included IntentSchema.json in the speechAssets folder.
5. Copy the __Sample Utterances__ from the included SampleUtterances.txt. Click Next.
6. Go back to the skill Information tab and copy the appId. Paste the appId into the index.js file for the variable __APP_ID__, then update the Lambda source zip file with this change and __upload to Lambda__ again, this step makes sure the Lambda function only serves request from authorized source.
7. You are now able to start testing your Alexa skill! You should be able to go to the [Echo webpage](http://echo.amazon.com/#skills) and see your skill enabled.
8. In order to test it, try to say some of the Sample Utterances from the Examples section below.
9. Your skill is now saved and once you are finished testing you can continue to publish your skill.

## Examples

```
User: "Alexa, will you see me now?"
Alexa: "...."
```

If you are running [AlexaPi](https://github.com/alexa-pi/AlexaPi) on Raspberry Pi, or using a wake word engine like [Snowboy](https://github.com/Kitt-AI/snowboy), you can change the wake word from "Alexa" to "Magic Mirror", then you can say:

```
User: "Magic Mirror, ...."
Alexa: "...."
```


## List of commands
TODO


