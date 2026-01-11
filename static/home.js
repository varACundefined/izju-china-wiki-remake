var title = document.getElementById('titleImage');

function WindowSize() {
  if (!title) return;
  title.height = window.outerHeight;
  title.width = window.outerWidth;
}

window.addEventListener('resize', WindowSize);
window.addEventListener('load', WindowSize);

        
function numScroll(id, maxNum, time) {
  var numDom = document.getElementById(id)
  if(!numDom) return;
  var numInit = 0
  var addNum = maxNum / (time / 10)
  var minTime = time / maxNum
  var t = setInterval(function() {
      if (numInit >= maxNum) {
          
          clearInterval(t)
          numDom.innerText = maxNum
      } else {
          numInit += addNum
          numDom.innerText = Math.round(numInit)
      }
  }, 10)
}
numScroll('num', 60, 3000)
setInterval(function() {
  numScroll('num', 60, 3000)
},10000)        

// AMR number jumping animation
var deathAnimated = false;
var moneyAnimated = false;

function formatNumber(num) {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(0) + ' Trillion';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + ' Million';
  }
  return num.toLocaleString();
}

function animateDeathCount() {
  if (deathAnimated) return;
  deathAnimated = true;
  
  var numDom = document.getElementById('death-count');
  var target = 10000000; // 10 million
  var duration = 1000; // faster
  var steps = 40;
  var increment = target / steps;
  var current = 0;
  var stepTime = duration / steps;
  
  var timer = setInterval(function() {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    numDom.innerText = formatNumber(Math.round(current));
  }, stepTime);
}

function animateMoneyCount() {
  if (moneyAnimated) return;
  moneyAnimated = true;
  
  var numDom = document.getElementById('money-count');
  var target = 100000000000000; // 100 trillion
  var duration = 1000; // faster
  var steps = 40;
  var increment = target / steps;
  var current = 0;
  var stepTime = duration / steps;
  
  var timer = setInterval(function() {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    numDom.innerText = formatNumber(Math.round(current));
  }, stepTime);
}        





var scrollTopLast = 0
// Safely reference old video element if it exists; avoids ReferenceError when the
// old <video id="video"> was removed in favor of an embedded iframe.
var homeVideo = document.getElementById('video') || null
let vh = window.innerHeight *0.01

window.onscroll=function(e){
var scrollTop = e.target.scrollingElement.scrollTop;
if(scrollTop > scrollTopLast){
    $(".my-nav").css("transition", "0.5s")
    $(".my-nav").css("opacity", "0")
}else{
    $(".my-nav").css("transition", "0.5s")
    $(".my-nav").css("opacity", "1")
}

//   if(scrollTop > 1100 && scrollTop-scrollTopLast >0){
//   document.getElementById("video").muted =true;
// }


// if(scrollTop > 600 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast0").style.animationPlayState="running";
//   document.getElementById("yeast0").style.display = "block"
// }
// if(scrollTop < 600){
//   document.getElementById("yeast0").style.display = 'none';
// }


// if(scrollTop > 700 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast1").style.animationPlayState="running";
//   document.getElementById("yeast1").style.display = "block"
// }
// if(scrollTop < 700){
//   document.getElementById("yeast1").style.display = 'none';
// }

// if(scrollTop > 750 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast2").style.animationPlayState="running";
//   document.getElementById("yeast2").style.display = "block"
// }
// if(scrollTop < 750){
//   document.getElementById("yeast2").style.display = 'none';
// }

// if(scrollTop > 800 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast3").style.animationPlayState="running";
//   document.getElementById("yeast3").style.display = "block"
// }
// if(scrollTop < 800){
//   document.getElementById("yeast3").style.display = 'none';
// }

// if(scrollTop > 900 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast4").style.animationPlayState="running";
//   document.getElementById("yeast4").style.display = "block"
// }
// if(scrollTop < 900){
//   document.getElementById("yeast4").style.display = 'none';
// }
// if(scrollTop > 1100 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast5").style.animationPlayState="running";
//   document.getElementById("yeast5").style.display = "block"
// }
// if(scrollTop < 1100){
//   document.getElementById("yeast5").style.display = 'none';
// }
// if(scrollTop > 1300 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast6").style.animationPlayState="running";
//   document.getElementById("yeast6").style.display = "block"
// }
// if(scrollTop < 1300){
//   document.getElementById("yeast6").style.display = 'none';
// }
// if(scrollTop > 1400 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast7").style.animationPlayState="running";
//   document.getElementById("yeast7").style.display = "block"
// }
// if(scrollTop < 1400){
//   document.getElementById("yeast7").style.display = 'none';
// }
// if(scrollTop > 1500 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast8").style.animationPlayState="running";
//   document.getElementById("yeast8").style.display = "block"
// }
// if(scrollTop < 1500){
//   document.getElementById("yeast8").style.display = 'none';
// }
// if(scrollTop > 1600 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast9").style.animationPlayState="running";
//   document.getElementById("yeast9").style.display = "block"
// }
// if(scrollTop < 1600){
//   document.getElementById("yeast9").style.display = 'none';
// }
// if(scrollTop > 1700 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast10").style.animationPlayState="running";
//   document.getElementById("yeast10").style.display = "block"
// }
// if(scrollTop < 1700){
//   document.getElementById("yeast10").style.display = 'none';
// }
// if(scrollTop > 1900 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast11").style.animationPlayState="running";
//   document.getElementById("yeast11").style.display = "block"
// }
// if(scrollTop < 1900){
//   document.getElementById("yeast11").style.display = 'none';
// }
// if(scrollTop > 2000 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast12").style.animationPlayState="running";
//   document.getElementById("yeast12").style.display = "block"
// }
// if(scrollTop < 2000){
//   document.getElementById("yeast12").style.display = 'none';
// }
// if(scrollTop > 2100 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast13").style.animationPlayState="running";
//   document.getElementById("yeast13").style.display = "block"
// }
// if(scrollTop < 2100){
//   document.getElementById("yeast13").style.display = 'none';
// }
// if(scrollTop > 2200 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast14").style.animationPlayState="running";
//   document.getElementById("yeast14").style.display = "block"
// }
// if(scrollTop < 2200){
//   document.getElementById("yeast14").style.display = 'none';
// }
// if(scrollTop > 2300 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast15").style.animationPlayState="running";
//   document.getElementById("yeast15").style.display = "block"
// }
// if(scrollTop < 2300){
//   document.getElementById("yeast15").style.display = 'none';
// }
// if(scrollTop > 2500 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast16").style.animationPlayState="running";
//   document.getElementById("yeast16").style.display = "block"
// }
// if(scrollTop < 2500){
//   document.getElementById("yeast16").style.display = 'none';
// }
// if(scrollTop > 2600 && scrollTop-scrollTopLast >0){
//   document.getElementById("yeast17").style.animationPlayState="running";
//   document.getElementById("yeast17").style.display = "block"
// }
// if(scrollTop < 2600){
//   document.getElementById("yeast17").style.display = 'none';
// }



// AMR Section - Second screen
// (subtitle1 removed as it doesn't exist)

// Trigger "Rising" title fade-in (165vh content - 60vh advance = 105vh trigger)
if(scrollTop > 45*vh){
  var risingTitle = document.getElementById("rising-title");
  if(risingTitle) risingTitle.style.animationPlayState= 'running';
  // Simultaneously trigger "Rising" text upward animation
  var risingText = document.getElementById("rising-text");
  if(risingText) risingText.style.animationPlayState= 'running';
}

// Trigger data box fade-in and number jumping animation (185vh content - 60vh advance = 125vh trigger)
if(scrollTop > 65*vh){
  var statsContainer = document.getElementById("stats-container");
  if(statsContainer) statsContainer.style.animationPlayState= 'running';
}

if(scrollTop > 60*vh){
  animateDeathCount();
  animateMoneyCount();
}

// Trigger "failing" title fade-in (250vh content - 60vh advance = 190vh trigger)
if(scrollTop > 130*vh){
  var failingTitle = document.getElementById("failing-title");
  if(failingTitle) failingTitle.style.animationPlayState= 'running';
}

// Trigger "failing" text falling animation (triggered simultaneously)
if(scrollTop > 130*vh){
  var failingText = document.getElementById("failing-text");
  if(failingText) failingText.style.animationPlayState= 'running';
}

// Third screen: Resistance fuels transmission
// Trigger "Resistance fuels transmission" title fade-in (280vh content - 60vh advance = 220vh trigger)
if(scrollTop > 160*vh){
  var transmissionTitle = document.getElementById("transmission-title");
  if(transmissionTitle) transmissionTitle.style.animationPlayState= 'running';
  // Simultaneously trigger "Resistance" text pulsing animation
  var resistanceText = document.getElementById("resistance-text");
  if(resistanceText) resistanceText.style.animationPlayState= 'running';
}

// Trigger left image fade-in (310vh content - 60vh advance = 250vh trigger)
if(scrollTop > 190*vh){
  var transmissionImage = document.getElementById("transmission-image");
  if(transmissionImage) transmissionImage.style.animationPlayState= 'running';
}

// Trigger right-side data boxes fade-in (triggered sequentially, 10vh intervals)
if(scrollTop > 195*vh){
  var stat1 = document.getElementById("transmission-stat1");
  if(stat1) stat1.style.animationPlayState= 'running';
}

if(scrollTop > 205*vh){
  var stat2 = document.getElementById("transmission-stat2");
  if(stat2) stat2.style.animationPlayState= 'running';
}

// Trigger "Resist and spread" title fade-in (400vh content - 60vh advance = 340vh trigger)
if(scrollTop > 280*vh){
  var spreadTitle = document.getElementById("spread-title");
  if(spreadTitle) spreadTitle.style.animationPlayState= 'running';
  // Simultaneously trigger "Resist" text shaking animation
  var spreadText = document.getElementById("spread-text");
  if(spreadText) spreadText.style.animationPlayState= 'running';
}

// Promotion Video section: Second to last screen
if(scrollTop > 530*vh){
  var subVideo = document.getElementById('subtitle-video');
  if (subVideo) subVideo.style.animationPlayState = 'running';
}
if(scrollTop > 545*vh){
  var videoContainer = document.getElementById('video-container');
  if (videoContainer) videoContainer.style.animationPlayState = 'running';
}

// Page 4: ESKAPE Pathogens new design
// a) Title and description text
if(scrollTop > 330*vh){
  var eskapeTitle = document.getElementById('eskape-title');
  if (eskapeTitle) eskapeTitle.style.animationPlayState = 'running';
}
// b) ESKAPE bacteria image
if(scrollTop > 350*vh){
  var eskapeImage = document.getElementById('eskape-image');
  if (eskapeImage) eskapeImage.style.animationPlayState = 'running';
}
// c) Three data boxes
if(scrollTop > 400*vh){
  var eskapeStats = document.getElementById('eskape-stats');
  if (eskapeStats) eskapeStats.style.animationPlayState = 'running';
}
// d) Bottom large box
if(scrollTop > 425*vh){
  var eskapeBottom = document.getElementById('eskape-bottom');
  if (eskapeBottom) eskapeBottom.style.animationPlayState = 'running';
}

// Page 5.5: MRSA Introduction (590vh)
// a) MRSA title
if(scrollTop > 470*vh){
  var mrsaTitle = document.getElementById('mrsa-title');
  if (mrsaTitle) mrsaTitle.style.animationPlayState = 'running';
}
// b) MRSA content (left image + right boxes)
if(scrollTop > 490*vh){
  var mrsaContent = document.getElementById('mrsa-content');
  if (mrsaContent) mrsaContent.style.animationPlayState = 'running';
}
// c) MRSA goal bottom box
if(scrollTop > 542*vh){
  var mrsaGoal = document.getElementById('mrsa-goal');
  if (mrsaGoal) mrsaGoal.style.animationPlayState = 'running';
}

// FoCas Platform section (page 6, moved from 600vh to 680vh)
// a) FoCas title
if(scrollTop > 580*vh){
  var focasTitle = document.getElementById('focas-title');
  if (focasTitle) focasTitle.style.animationPlayState = 'running';
}
// b) FoCas left-right content
if(scrollTop > 593*vh){
  var focasContent = document.getElementById('focas-content');
  if (focasContent) focasContent.style.animationPlayState = 'running';
}
// c) FoCas targeted knockout description
if(scrollTop > 606*vh){
  var focasTarget = document.getElementById('focas-target');
  if (focasTarget) focasTarget.style.animationPlayState = 'running';
}

// Page 7: Four Functional Components (820vh)
if(scrollTop > 700*vh){
  var fourComponentTitle = document.getElementById('four-component-title');
  if (fourComponentTitle) fourComponentTitle.style.animationPlayState = 'running';
}
if(scrollTop > 720*vh){
  var fourComponentImage = document.getElementById('four-component-image');
  if (fourComponentImage) fourComponentImage.style.animationPlayState = 'running';
}

// Page 8: Five Acting Module (940vh)
if(scrollTop > 820*vh){
  var fiveModuleTitle = document.getElementById('five-module-title');
  if (fiveModuleTitle) fiveModuleTitle.style.animationPlayState = 'running';
}
if(scrollTop > 840*vh){
  var fiveModuleImage = document.getElementById('five-module-image');
  if (fiveModuleImage) fiveModuleImage.style.animationPlayState = 'running';
}

// Page 9: Application: MRSA Wound Infection (1060vh)
if(scrollTop > 940*vh){
  var applicationTitle = document.getElementById('application-title');
  if (applicationTitle) applicationTitle.style.animationPlayState = 'running';
}
if(scrollTop > 960*vh){
  var applicationImage = document.getElementById('application-image');
  if (applicationImage) applicationImage.style.animationPlayState = 'running';
}
if(scrollTop > 1020*vh){
  var applicationMethod = document.getElementById('application-method');
  if (applicationMethod) applicationMethod.style.animationPlayState = 'running';
}

// Page 10: Simple Procedure (1200vh)
if(scrollTop > 1080*vh){
  var procedureTitle = document.getElementById('procedure-title');
  if (procedureTitle) procedureTitle.style.animationPlayState = 'running';
  var pmsCards = document.getElementById('pms-cards');
  if (pmsCards) pmsCards.style.animationPlayState = 'running';
}
if(scrollTop > 1100*vh){
  var procedureImage = document.getElementById('procedure-image');
  if (procedureImage) procedureImage.style.animationPlayState = 'running';
}
if(scrollTop > 1200*vh){
  var procedureSteps = document.getElementById('procedure-steps');
  if (procedureSteps) procedureSteps.style.animationPlayState = 'running';
}

// Promotion Video section (1360vh)
if(scrollTop > 1240*vh){
  var subtitleVideo = document.getElementById('subtitle-video');
  if (subtitleVideo) subtitleVideo.style.animationPlayState = 'running';
}
if(scrollTop > 1265*vh){
  var videoContainer = document.getElementById('video-container');
  if (videoContainer) videoContainer.style.animationPlayState = 'running';
}



scrollTopLast = scrollTop;
}

// var bubble2 = document.getElementById("bubble2")
// bubble2.onclick=function(){
//     location.href={{ url_for('pages', page = 'results')}};
// }



// var seesaw = document.getElementById("seesaw");
//   var flag = true;
//   seesaw.onclick = function (){
//       if (flag){
//           seesaw.src = "https://static.igem.wiki/teams/5371/homepage/seesaw.gif";
//           flag = false;
//       }else{
//           seesaw.src = "https://static.igem.wiki/teams/5371/homepage/seesaw-stop.png";
//           flag = true;
//       }
//   }


