//Global variables
//I will use these variables often in my code

var canvas=document.getElementById('stage');
var word=document.getElementById('word');
var letters=document.getElementById('letters');

var wordToGuess;
var wordLength;
var badGuesses;
var correctGuesses;

function init(){

   var helptext=$('#helptext');
   var w=screen.availWidth<=800?screen.availWidth:800;

   //Hide the loading message and display control buttons
    
   $('#loading').hide();
   $('#play').css('display','inline-block').click(newGame);
   $('#clear').css('display','inline-block').click(resetScore);
   
   $('#help').click(function(e){
  
       $('body').append('<div id="mask"></div>');
       helptext.show().css('margin-left',(w-300)/2+'px');
   });

   /* We have attached a function to click on help which does two things
      1)It appends to body an empty div which masks the body with a semi-transparent black backkground ,like popup box
      2)It shows helptext div which was hidden by default.It calculates left margin of helptext div to center it in browser viewport.
        helptext div has z-index of 10 so its on top of mask.

   */
   
   $('#close').click(function(e){

      $('#mask').remove();
      helptext.hide();

   });

   //Rescale the canvas if the screen is wider than 700px
   if(screen.innerWidth>=700){
    
        canvas.getContext('2d').scale(1.5,1.5);
   }

   if(localStorage.getItem('hangmanWin')==null){

       localStorage.setItem('hangmanWin','0');
     
   }

   if(localStorage.getItem('hangmanLose')==null){

       localStorage.setItem('hangmanLose','0');
   }

   showScore();

}

function showScore(){

   var won=localStorage.getItem('hangmanWin'),
       lost=localStorage.getItem('hangmanLose'),
       c=canvas.getContext('2d');
   //clear the canvas

   canvas.width=canvas.width;    
 
   c.font='bold 24px Optimer,Arial,Helvetica';

   c.fillStyle='red';
   c.textAlign='center';
   c.fillText('Your score',100,50);
   
   c.font='bold 18px Optimer,Arial,Helvetica';
   c.fillText('Won: '+won+' Lost: '+lost,100,80);
}

function newGame(){

   var placeholders='',
   frag=document.createDocumentFragment(),
   abc=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

   badGuesses=0;
   correctGuesses=0;
   wordToGuess=getWord();
   wordLength=wordToGuess.length;
 
   //create row of underscores the same length as word to guess

   for(var i=0;i<wordLength;i++){
    
      placeholders+='_';

   } 

   word.innerHTML=placeholders;
   
   //Creating an alphabet pad to select letters

   /*
      Alphabetic keypad is built by looping through the abc array and adding a div containing current letter to document fragment stored in frag.
      The first line of below code sets the innerHTML property to empty string so that screen from previous game is removed.

   */

   letters.innerHTML='';

   for(var i=0;i<26;++i){

     var div=document.createElement('div');
     div.style.cursor='pointer';
     div.innerHTML=abc[i];
     div.onclick=getLetter;
     frag.appendChild(div);

   }
   
   letters.appendChild(frag);
  
}
function getLetter(){

    checkLetter(this.innerHTML);
    this.innerHTML='&nbsp;';
    this.style.cursor='default';
    this.onclick=null;

}

function checkLetter(letter) {
	var placeholders = word.innerHTML,
	    wrongGuess = true;
	// split the placeholders into an array
	placeholders = placeholders.split('');
	// loop through the array
	for (var i = 0; i < wordLength; i++) {
		// if the selected letter matches one in the word to guess,
		// replace the underscore and increase the number of correct guesses
		if (wordToGuess.charAt(i) == letter.toLowerCase()) {
			placeholders[i] = letter;
			wrongGuess = false;
			correctGuesses++;
			// redraw the canvas only if all letters have been guessed
			if (correctGuesses == wordLength) {
				drawCanvas();
			}
		}
	}
	// if the guess was incorrect, increment the number of bad
	// guesses and redraw the canvas
	if (wrongGuess) {
		badGuesses++;
		drawCanvas();
	}
	// convert the array to a string and display it again
	word.innerHTML = placeholders.join('');
}

function drawCanvas(){
 
   var c=canvas.getContext('2d');
 
   //reset the canvas and set basic styles

   canvas.width=canvas.width;
   
   c.lineWidth=10;
   c.strokeStyle='green';    
   c.font='bold 24px Optimer,Arial,Helvetica,sans-serif';
   c.fillStyle='red';
   //drawing the ground
   drawLine(c,[20,190],[180,190]);
   //start building the gallows if there'sbeen a bad guess
   if(badGuesses>0){

      //create the upright
      c.strokeStyle='#A52A2A';
      drawLine(c,[30,185],[30,10]);

      if(badGuesses>1){

          //create the arm of gallows
          c.lineTo(150,10);
          c.stroke();

      }

      if(badGuesses>2){

          c.strokeStyle='black';
          c.lineWidth=3;
          //draw rope
          drawLine(c,[145,15],[145,30]);
          //draw head
          c.beginPath();
          c.moveTo(160,45);
          c.arc(145,45,15,0,(Math.PI/180)*360);
          c.stroke();

      }

      if(badGuesses>3){

         //draw body

         drawLine(c,[145,60],[145,130]);
      }

      if(badGuesses>4){

         //draw left arm
         drawLine(c,[145,80],[110,90]);

      }

      if(badGuesses>5){

         //draw right arm

         drawLine(c,[145,80],[180,90]);

      }

      if(badGuesses>6){

         //draw left leg
         drawLine(c,[145,130],[130,170]);

      }

      if(badGuesses>7){

         //draw right leg and end game

         drawLine(c,[145,130],[160,170]);
         c.fillText('Game over',45,110);

         //remove the alphabet pad

         letters.innerHTML='';
         //display the correct answer
         //need to use setTimeout to prevent racing
         setTimeout(showResult,200);
         //increse score of lost games
         //display score after 2 seconds
         localStorage.setItem('hangmanLose',1+parseInt(localStorage.getItem('hangmanLose'))); 
         setTimeout(showScore,2000);
      }

   }
   //if the word has been guessed correctly,display message
   //update score of games won and then show score after 2 seconds pause
   if(correctGuesses==wordLength){

      letters.innerHTML='';
      c.fillText('You won!',45,110);
      //increase score of won games
      //display score
      localStorage.setItem('hangmanWin',1+parseInt(localStorage.getItem('hangmanWin')));
      setTimeout(showScore,2000);
   }


}

function drawLine(context, from, to) {
	context.beginPath();
	context.moveTo(from[0], from[1]);
	context.lineTo(to[0], to[1]);
	context.stroke();
}

function showResult(){

    var placeholders=word.innerHTML;
    placeholders=placeholders.split('');
  
    for(i=0;i<wordLength;i++){

         if(placeholders[i]=='_'){

              placeholders[i]='<span style="color:red">'+wordToGuess.charAt(i).toUpperCase()+'</span>';

         }

    }

    word.innerHTML=placeholders.join('');
}

function resetScore(){

  localStorage.setItem('hangmanWin','0');
  localStorage.setItem('hangmanLose','0');

  showScore();

}

function getWord(){

    var a=new Array('codeforces','spoj','timus','topcoder','codechef','hackerrank','hackerearth','uva','codefights','codemarshal','pku','aizu','leetcode','rosalind','sharecode','uri','projecteuler','infoarena','sharecode');
    return a[parseInt(Math.random()*a.length)];
}











