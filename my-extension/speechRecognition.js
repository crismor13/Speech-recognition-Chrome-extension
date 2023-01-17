document.addEventListener("DOMContentLoaded", function() {

    function playPause() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.executeScript(tabs[0].id, {code: "document.querySelector('video').paused ? document.querySelector('video').play() : document.querySelector('video').pause();"});
      });
    }

    function forwardVideo() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.executeScript(tabs[0].id, {code: "var video = document.querySelector('video'); video.currentTime += 6;"});
      });
    }
  
    function rewindVideo() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.executeScript(tabs[0].id, {code: "var video = document.querySelector('video'); video.currentTime -= 6;"});
      });
    }

    if ("webkitSpeechRecognition" in window) {
        let speechRecognition = new webkitSpeechRecognition();
        let final_transcript = "";
      
        speechRecognition.continuous = true;
        speechRecognition.interimResults = true;
        speechRecognition.lang = 'en-US';
      
        speechRecognition.onstart = () => {
          document.querySelector("#status").style.display = "block";
        };
        speechRecognition.onerror = (e) => {
          document.querySelector("#status").style.display = "none";
          console.log("Speech Recognition Error", e.error, e.message);
        };
        speechRecognition.onend = () => {
          document.querySelector("#status").style.display = "none";
          console.log("Speech Recognition Ended");
        };
      
        speechRecognition.onresult = (event) => {
          let interim_transcript = "";
      
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
              console.log(event.results[i][0])
              
              lastWorld = event.results[i][0].transcript
              if (lastWorld.includes('start')  || lastWorld.includes('stop')){
                playPause();
              } else if (lastWorld.includes('left')){
                rewindVideo();
              } else if (lastWorld.includes('right')){
                forwardVideo();
              }
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }
          document.querySelector("#final").innerHTML = final_transcript;
          document.querySelector("#interim").innerHTML = interim_transcript;
        };
      
        document.querySelector("#start").onclick = () => {
          speechRecognition.start();
        };
        document.querySelector("#stop").onclick = () => {
          speechRecognition.stop();
        };
    } else {
    console.log("Speech Recognition Not Available");
    }
})