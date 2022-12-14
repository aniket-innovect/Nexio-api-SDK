const nexioObj = new Nexio.NexioApi("dXNlcl8zNTBkM2FjMDZjM2E0ODU4YTI5ZGZkZDAwZmJiZWUwNjphcGlLZXlfc2p4UkNiZVZCdTVHc3k=");
let tokenValue;
const iframeUrl = 'https://api.nexiopaysandbox.com';

const oneTimeTokenElement = document.getElementById("oneTimeBtn");
oneTimeTokenElement.addEventListener("click", oneTimeTokenFunction);

const saveCardTokenElement = document.getElementById("saveCardBtn");
saveCardTokenElement.addEventListener("click", saveCardIFrameFunction);

const oneTimeIFrameTokenElement = document.getElementById("oneTimeIFrameBtn");
oneTimeIFrameTokenElement.addEventListener("click", oneTimeIFrameTokenFunction);

const cardTransactionElement = document.getElementById("cardTransBtn");
cardTransactionElement.addEventListener("click", cardTransIframeFunction);

const myForm = document.getElementById("myForm");

window.addEventListener('message', function messageListener(event) {
    if (event.origin === iframeUrl) {
        const eventData = event.data?.data;
        const eventType = event.data?.event;

        if (eventType === "loaded") {
            console.log("Iframe loaded")
        }

        if (eventType === "cardSaved") {
            this.alert("The Card Has been Saved");
            console.log("Card Has been Saved",eventData);
            // console.log("Card Has been Saved",JSON.parse(eventData));
        }

        if (eventType === "processed") {
            this.alert("The Transaction has been processed");
            console.log("Transaction Processed ",eventData);
            // console.log("Card Has been Saved",JSON.parse(eventData));
        }
        if (eventData === "error") {
            console.log("Iframe error", eventData);
        }

        if (eventType === "formValidations") {
            const jsonData = eventData;
            if (jsonData.isFormValid) {
            }
        }
        // switch on event.data properties
        // (e.g. loaded, formValidations, error)
    }
});


 myForm.addEventListener('submit', async function processPayment(event) {
    event.preventDefault();
    var response = await myIframe.contentWindow.postMessage('posted', iframeUrl);
    // const data = await response;
    console.log("The Data is ",response);
//      .then(res=>{
//     console.log("THe Reponse is ",res);
//    }).catch(error=>
//     console.log("Error occured ",error));

    return false; // keeps the form from auto submitting
});

function oneTimeTokenFunction() {
    Nexio.saveCardOneTimeTokenApi(nexioObj)
        .then(saveCardOneTimeToken => {
            console.log("saveCardOneTimeToken token value", saveCardOneTimeToken['token']);
            tokenValue = saveCardOneTimeToken['token'];
            document.getElementById("demo").innerHTML = tokenValue;
        })
}

function saveCardIFrameFunction() {
    Nexio.saveCardIFrameFn(tokenValue, nexioObj)
        .then(saveCardUrl => {
            window.document.getElementById('myIframe').src = saveCardUrl;
        })
}

function oneTimeIFrameTokenFunction() {
    nexioObj.updateDataobject("amount", 29);
    nexioObj.updateDataobject("currency", "USD");
    Nexio.oneTimeIFrameTokenApi(nexioObj)
        .then(oneTimeIFrameToken => {
            console.log("runCardOneTimeIFrame token value", oneTimeIFrameToken['token']);
            tokenValue = oneTimeIFrameToken['token'];
            document.getElementById("demo").innerHTML = tokenValue;
        })
}

function cardTransIframeFunction() {
    Nexio.cardTransIFrameFn(tokenValue, nexioObj)
        .then(runCardUrl => {
            window.document.getElementById('myIframe').src = runCardUrl;
        })
}
function makePost(payload,callback,url,successEventName,threeDSUrl,fields,checkThreeDS)
{var postUrl,eventName,xmlhttp=new XMLHttpRequest;
    checkThreeDS?(postUrl=threeDSUrl,eventName="threeDS"):(eventName=successEventName,postUrl=url),xmlhttp.onreadystatechange=function(){if(xmlhttp.responseText&&4===xmlhttp.readyState){if(200!==xmlhttp.status||"error"===JSON.parse(xmlhttp.responseText).status)eventName="error";else if(checkThreeDS){var normalThreeDSResponse=JSON.parse(xmlhttp.responseText);normalThreeDSResponse.redirectUrl?window.location.replace(normalThreeDSResponse.redirectUrl):eventName="processed"}callback(xmlhttp.responseText,eventName)}},xmlhttp.open("POST",postUrl,!0),xmlhttp.setRequestHeader("content-type","application/json"),xmlhttp.send(payload)}
