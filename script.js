/////generazione di immagini dinamica
function onJson1(json){
    console.log('json1 ricevuto');

    for(let i=0; i<9; i++){
        boxlist[i].querySelector('img').src = json.products[i].image_front_url;
    }
}
function onJson2(json){
    console.log('json2 ricevuto');

    for(let i=0; i<9; i++){
        boxlist[i+9].querySelector('img').src = json.products[i].image_front_url;
    }
}
function onJson3(json){
    console.log('json3 ricevuto');

    for(let i=0; i<9; i++){
        boxlist[i+18].querySelector('img').src = json.products[i].image_front_url;
    }
}

function onResponse(response){
    return response.json();
}

function generateImgs(){
    console.log('Generazione immagini');

    const urls=['https://it-en.openfoodfacts.org/category/breakfasts.json',
                'https://it-en.openfoodfacts.org/category/pizzas.json',
                'https://it-en.openfoodfacts.org/category/piadina.json'];
    
    fetch(urls[0]).then(onResponse).then(onJson1);
    fetch(urls[1]).then(onResponse).then(onJson2);
    fetch(urls[2]).then(onResponse).then(onJson3);
}
//////


function onJson(json){
    console.log(json);

    
    const divPadre = document.querySelector('.answer');

    const div = document.createElement('div');
    const intestazione = document.createElement('h3');
    const titolo = document.createElement('a');
    const img = document.createElement('img');

    intestazione.textContent = 'Canzone che rispecchia la tua personalità:';
    img.src = json.album.images[1].url;
    titolo.href=json.external_urls.spotify;
    titolo.textContent=json.name;
    

    div.setAttribute('id','songDiv')

    div.appendChild(intestazione);
    div.appendChild(img);
    div.appendChild(titolo);

    divPadre.appendChild(div);

    const button = document.createElement('button');
    button.textContent='Ricomincia il quiz';
    button.addEventListener('click',reset);
    divPadre.appendChild(button);

}
/////

function reset(){
    
    for(let i=0;i<3;i++){
        selected[i]=0;
    }

    const div = document.querySelector('.answer');
    div.remove();
    
    for(const box of boxlist){
        box.style.opacity=1;
        box.querySelector('.checkbox').src='images/unchecked.png';
        box.style.backgroundColor= '#f4f4f4';

        box.addEventListener('click',selectBox);
    }

}

function getAnswer(mapIndex){
    console.log(RESULTS_MAP[mapIndex]);


    const div = document.createElement('div');
    const title = document.createElement('h1');
    const paragraph = document.createElement('p');
    
    title.textContent=RESULTS_MAP[mapIndex].title;
    paragraph.textContent=RESULTS_MAP[mapIndex].contents;

    const article = document.querySelector('article');
    div.appendChild(title);
    div.appendChild(paragraph);
    
    div.classList.add('answer');
    
    article.appendChild(div);
    

  fetch('https://api.spotify.com/v1/tracks/' + RESULTS_MAP[mapIndex].track,
        {
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
    ).then(onResponse).then(onJson);
    
}
function getChoice(){

    if (selected[0].dataset.choiceId !== selected[1].dataset.choiceId !== selected[2].dataset.choiceId){

        getAnswer(selected[0].dataset.choiceId);

    }else{

        if(selected[2].dataset.choiceId != selected[1].dataset.choiceId){
            //caso 1&3 || 1&2
            getAnswer(selected[0].dataset.choiceId);
        }else{
            //caso 2&3
            getAnswer(selected[2].dataset.choiceId);
        }

    }

}

function blockSelection(){
    for(const box of boxlist){
        box.removeEventListener('click',selectBox);
    }
}

function highlight(container){
    container.style.opacity=1;
    container.querySelector('.checkbox').src='images/checked.png';
    container.style.backgroundColor= '#cfe3ff';
}

function hideUnselected(qId){
    for(const box of boxlist){
        if (box.dataset.questionId===qId){
            box.style.opacity=0.6;
            box.querySelector('.checkbox').src='images/unchecked.png';
            box.style.backgroundColor= '#f4f4f4';
        }
    }
}

function selectBox(event){

    const container = event.currentTarget;

    if(container.dataset.questionId==='one'){
        selected.splice(0,1);
        selected.splice(0,0,container);

    }else if(container.dataset.questionId==='two'){
        selected.splice(1,1);
        selected.splice(1,0,container);

    }else{
        selected.splice(2,1);
        selected.splice(2,0,container);
    }
    console.log(selected);

    hideUnselected(container.dataset.questionId);
    highlight(container);

    for(const box of selected){
        if(box===0){return;}
    }
    blockSelection();
    getChoice();
    
}
//////
function onTokenResponse(response){
    return response.json();
}

function onTokenJson(json){
    //console.log(json);

    token=json.access_token;

   // console.log('token:'+token);
}

const boxlist=[];
const selected=[0,0,0];

const boxes = document.querySelectorAll('.choice-grid div');

for(const box of boxes){
    box.addEventListener('click',selectBox);
    boxlist.push(box);
}

const client_id='0af500438cfc40a884e5fa4dd4ff5e3d';
const client_secret='d2a41eda48af4555ae12544bf0e3cf41';
let token;

fetch('https://accounts.spotify.com/api/token',
    {
        method: "post",
        body: 'grant_type=client_credentials',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Authorization': 'Basic '+btoa(client_id+':'+client_secret)
        }
    }
).then(onTokenResponse).then(onTokenJson);

generateImgs();