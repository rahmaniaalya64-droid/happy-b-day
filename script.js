let currentBlownState = false;


function checkPin() {
    const pinInput = document.getElementById('pinInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
   
    if (pinInput === "060603") {
        errorMessage.classList.add('hidden');
        nextPage(2); 
        initMicrophone();
    } else {
        errorMessage.classList.remove('hidden');
        document.getElementById('pinInput').value = ""; 
    }
}


function nextPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(`page${pageNumber}`).classList.add('active');

    if (pageNumber === 2) {
        currentBlownState = false;
        document.getElementById('flame').style.display = 'block';
    }
}


function blowOut() {
    if (currentBlownState) return;
    currentBlownState = true;

    document.getElementById('flame').style.display = 'none';

    
    const coffeeColors = ['#4A3B32', '#9C8470', '#E6D8CE', '#D4AF37'];
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.6 },
            colors: coffeeColors
        });
    }

    
    setTimeout(() => {
        nextPage(3);
    }, 1200);
}


document.getElementById('cakeContainer').addEventListener('click', blowOut);


function initMicrophone() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);
            analyser.connect(javascriptNode);
            javascriptNode.connect(audioContext.destination);

            javascriptNode.onaudioprocess = function() {
                if (currentBlownState) return;
                const array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                let values = 0;

                for (let i = 0; i < array.length; i++) {
                    values += array[i];
                }

                const average = values / array.length;

                
                if (average > 65) {
                    blowOut();
                    
                    stream.getTracks().forEach(track => track.stop());
                }
            };
        })
        .catch(function(err) {
            console.log("Mic access denied or not supported. Tap function active.", err);
        });
    }
}


function openGift() {
    const giftBox = document.getElementById('giftBox');
    const giftBoxOpen = document.getElementById('giftBoxOpen');
    const voucherPrize = document.getElementById('voucherPrize');
    const claimText = document.getElementById('claimText');
    
   
    if(giftBox.classList.contains('opened')) return;
    giftBox.classList.add('opened');
    
   
    giftBox.style.animation = "shake 0.4s ease";
    
    setTimeout(() => {
        
        giftBox.classList.add('hidden');
        giftBox.style.display = 'none';
        giftBoxOpen.classList.remove('hidden');
        
       
        voucherPrize.classList.remove('hidden');
        voucherPrize.classList.add('popup-voucher');
        
       
        claimText.innerText = "YAY! You got a Free Kisses Ticket! 🎫💋 valid forever!";
        
        
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 50,
                origin: { y: 0.7 }
            });
        }
    }, 400); 
}
