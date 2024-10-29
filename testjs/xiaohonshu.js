
let pctitlewrap = document.getElementsByClassName('title');
pctitlewrap[0].children[0].textContent
let pcauthwrap = document.getElementsByClassName('author-wrapper');
pcauthwrap[1].children[0].children[1].textContent
let pcnoteItemwrap = document.getElementsByClassName('note-item');
pcnoteItemwrap[1].children[0].children[1].attributes.href




let targetTitle = '123';
let targetId = '12212';
let stopInterval = false;
let scrollInterval = setInterval(() => {
    window.scrollBy({top: 800,left: 0,behavior: 'smooth'});
    let pctitlewrap = document.getElementsByClassName('title');
    let pcnoteItemwrap = document.getElementsByClassName('note-item');
    for (let i = 0; i < pctitlewrap.length && i < 6; i++) {
        if(stopInterval){clearInterval(scrollInterval);break;}
        if (pctitlewrap[i] && pctitlewrap[i].children[0]) {
            let currentTitle = pctitlewrap[i].children[0].textContent;
            let hrefValue = pcnoteItemwrap[i].children[0].children[1].attributes.href.value;   
            let urlPart =  hrefValue.split('/').slice(1).join('/'); 
            let cardId = urlPart.match(/\/([^/?]+)/)[1];
            if (currentTitle == targetTitle && targetId == cardId) {pcnoteItemwrap[i].children[0].children[1].click();clearInterval(scrollInterval);break;}
        }
    } 
}, 1000); 



