window.addEventListener('load', () => {
    const darkModeBtn = document.querySelector('[data-switch]');
    const moonLogo = document.querySelector('[data-mLogo]');
    const sunLogo = document.querySelector('[data-sLogo]');
    const dmBg = document.querySelector('.dm-bg');
    const root = document.querySelector(':root');

    darkModeBtn.addEventListener('click', () => {
        darkModeBtn.classList.toggle('active');
        
        if (darkModeBtn.classList[2] == 'active') {
            moonLogo.style.display = "none";
            sunLogo.style.display = "inline";
            dmBg.classList.add('active');
            root.style.setProperty('--black', '#f2f2f2');
            root.style.setProperty('--darkGray', '#999');
            root.style.setProperty('--listColor', '#999');
            root.style.setProperty('--light', '#222');
            root.style.setProperty('--inLight', 'transparent');
        } else {
            moonLogo.style.display = "inline";
            sunLogo.style.display = "none";
            dmBg.classList.remove('active');
            root.style.setProperty('--black', '#222');
            root.style.setProperty('--listColor', '#444');
            root.style.setProperty('--darkGray', '#444');
            root.style.setProperty('--light', '#fff');
            root.style.setProperty('--inLight', '#f4f4f4');
        }
    
    })

    /* Web api */
    const input = document.querySelector('[data-input]');
    const searchBtn = document.querySelector('[data-search]'); 
    
    /* Html Variables */
    const title = document.querySelector('[data-title]');
    const loader = document.querySelector('.load-wrapper'); 
    /* Visibility of results */
    const wholeResult = document.querySelector('[data-card]');
    

    searchBtn.addEventListener('click', () => {
      wholeResult.classList.remove('active')
      loader.classList.add('active');

        /* Validation Container */
        const errMess = document.querySelector('.error-message');
        errMess.classList.remove('active');

        async function myFile() {
            /* Sections */
           const verbSec = document.querySelector('[data-verbSection]');
           const nounSec = document.querySelector('[data-nounSection]');
           const adjSec = document.querySelector('[data-adjSection]');

           verbSec.classList.remove('active');
           nounSec.classList.remove('active');
           adjSec.classList.remove('active');

          /* Synonyms texts */
          const allSynonymsText = document.querySelectorAll('.sy-result');
          const allSynonymsCon = document.querySelectorAll('.sy-con');

          allSynonymsText.forEach(txt => {
            txt.innerHTML = "";
          })

          allSynonymsCon.forEach(con => {
            con.classList.remove('active')
          })

          const myErrorMess = () => {
              errMess.classList.add('active');
              loader.classList.remove('active');
              wholeResult.classList.remove('active');
          }


            let word = (input.value).toLowerCase().trim();
            if (!word) {
              myErrorMess();
              return;
            }

            const file = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const result = await file.json();
            

            /* Validation */
            if (!file.ok || !word || word == " ") {
              myErrorMess();
              return;
            }

            /* Audio */
            const playBtn = document.querySelector('[data-play]');
            function myFunction() {
              let audio = "";
              for (let i = 0; i < result[0].phonetics.length; i++) {
                if (result[0].phonetics[i].audio != "") {
                  audio = new Audio(result[0].phonetics[i].audio);
                  
                }
              };
              
              if (audio != "") {
                audio.play();
              }   
              
            }

            /* console.log(word.includes(/\w/)) */
        
            playBtn.onclick = () => {
              myFunction();
            }

            /* Title */
            const arr = result[0].word.split('');
            arr[0] = arr[0].toUpperCase();
            title.innerHTML = arr.join('');
            

            /* Phonetics */
            const phonetics = document.querySelector('[data-phonetics]');   
            const listCon = document.querySelector('[data-meanList]');


            /* Adjective Variables */
            const adjCon = document.querySelector('[data-adjList]');


            /* Verb Variables */
            const verbCon = document.querySelector('[data-verbList]');

            const listCreator = (meaning, container) => {
              const listEl = document.createElement('li');
              listEl.innerHTML = meaning;
              container.appendChild(listEl);
            };

            const elementRemover = (container) => {
                while (container.hasChildNodes()) {
                    container.removeChild(container.firstChild)
                  }
            }

            const meanings = (el, con) => {
                elementRemover(con);
                    el.definitions.forEach(def => {
                       /*  def.definition */
                       listCreator(def.definition, con);
                    })
            };

            const classAdder = (section) => {
                section.classList.add('active');
                
                /* result[0].meanings[i].partOfSpeech */
                const list = section.nextElementSibling;
                if (list.querySelector('.sy-result').innerHTML != ""  
                 && list.querySelector('.sy-result').innerHTML != " ") {
                  list.classList.add('active')
                }
            }

             /* Synonyms */
             const verbSy = [];
             const vSynonymsCon = document.querySelector('[data-vsy]');
 
             const nounSy = [];
             const nSynonymsCon = document.querySelector('[data-nsy]');
 
             const adjSy = [];
             const aSynonymsCon = document.querySelector('[data-asy]');
 
             const synonyms = (element, arr, list) => {
               list.forEach(sy => {
                 arr.push(" " + sy);
               })
 
               element.innerHTML = arr.toString();
             };
             
             for (let i = 0; i < result[0].meanings.length; i++) {
             
                 if (result[0].meanings[i].partOfSpeech == 'verb') {
                    synonyms(vSynonymsCon, verbSy, result[0].meanings[i].synonyms)
                 }
 
                 if (result[0].meanings[i].partOfSpeech == 'noun') {
                     synonyms(nSynonymsCon, nounSy, result[0].meanings[i].synonyms)
                 }
 
                 if (result[0].meanings[i].partOfSpeech == 'adjective') {
                     synonyms(aSynonymsCon, adjSy, result[0].meanings[i].synonyms)
                  }
             }


             result[0].meanings.forEach(element => {
              if (element.partOfSpeech == 'noun') {
                meanings(element, listCon);
                classAdder(nounSec);
              }

              else if (element.partOfSpeech == 'verb') {
                meanings(element, verbCon);
                classAdder(verbSec);
              }

              else if (element.partOfSpeech == 'adjective') {
                meanings(element, adjCon);
                classAdder(adjSec);
              }


            });
            
            if (!result[0].phonetics.length == 0) {
              for (let i = 0; i < result[0].phonetics.length; i++) {
                console.log(result[0].phonetics[i])
                 if (result[0].phonetics[i].audio
                     ) {
                  phonetics.innerHTML = result[0].phonetics[i].text;
                 }    
              }
            } else  {
              phonetics.innerHTML = "";
            }
            
            

            /* Source Links */
            const link = result[0].sourceUrls[0];
            const anchors = document.querySelectorAll('[data-source]');

            anchors.forEach((a) => {
                a.href = link;
                if (!a.querySelector('img')) {
                    a.innerHTML = link;
                }
            })
            loader.classList.remove('active');
            wholeResult.classList.add('active');
        }

        myFile();
  
    });

    /* Font changer */
    const changerBtn = document.querySelector('[data-changer]');
    const listEl = document.querySelector('.font-list');
    const fontArr = document.querySelector('.font-img');
    const fontTitle = changerBtn.querySelector('h3');
    const body = document.querySelector('body');

    const allFontsBtns = document.querySelectorAll('.font-btn');
    changerBtn.addEventListener('click', () => {
      listEl.classList.toggle('active');
      fontArr.classList.toggle('active');
    })

    allFontsBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        
        switch(btn.innerHTML) {
          case 'Sans Serif':
          fontTitle.innerHTML = 'Sans';
          body.classList.add('font-sans');
          body.classList.remove('font-serif');
          body.classList.remove('font-mono');

          break;

          case 'Serif':
            fontTitle.innerHTML = 'Serif';
            body.classList.add('font-serif');
            body.classList.remove('font-sans');
            body.classList.remove('font-mono');
          break;

          case 'Mono':
            fontTitle.innerHTML = 'Mono';
            body.classList.add('font-mono');
            body.classList.remove('font-serif');
            body.classList.remove('font-sans');
          break;
        }

      })
    })

})