const cleanResult = () => {
    document.getElementById('resultShow').textContent = '';
    document.getElementById('resultAmount').textContent = '';
    document.getElementById('dataNotFound').textContent = '';
}


const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', (event)=>{
    event.preventDefault();

    //clear previous result
    cleanResult();


    const inputField = document.getElementById('inputField');
    const inputValue = inputField.value;

    if(inputValue.length > 0 && inputValue !== ' '){
        //start spinner
        document.getElementById('spinner-field').classList.remove('d-none');
        // clear error messages
        document.getElementById('emptyField').classList.add('d-none');

        //create valid dynamic url
        const url = `HTTPS://openlibrary.org/search.json?q=${inputValue}`;

        fetch(url)
            .then(res => res.json())
            .then(data => showData(data));
    }else{
        cleanResult();
        document.getElementById('emptyField').classList.remove('d-none');
    }
});



const showData = (data) => {

    if(data.docs.length > 0){
        const {numFound} = data;
        const books = data.docs;
        const span = document.getElementById('resultAmount');
        span.innerHTML = `
            <h6 class="text-primary mb-4">About <span class="fw-bold text-danger">${numFound}</span> results found. result showed <span class="fw-bold text-danger">(${books.length})</span> :</h6>
        `;

        books.forEach(element => {
            const parentDiv = document.getElementById('resultShow');

            const {title, cover_i, first_publish_year, author_name} = element;
            const author = author_name?.join();
            if(element.publisher){
                var [publisher] = element.publisher;
            }

            //create a div and append all card on it
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
                <div class="card mb-3" style="max-width: 540px;">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="HTTPS://covers.openlibrary.org/b/id/${cover_i}-M.jpg" class="img-fluid card-img rounded-start" alt="Book Cover">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">${title ? title : "..."}</h5>
                                <h6 class="text-secondary">by ${author_name ? author : "..."}</h6>
                                <p class="card-text"><small class="text-muted">First published in ${first_publish_year ? first_publish_year : "..."}</small></p>
                                <p class="card-text"><small class="text-muted">${publisher ? "Publisher: " + publisher : "..."}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // stop spinner
            document.getElementById('spinner-field').classList.add('d-none');

            parentDiv.appendChild(div);
        });
    }else{
        // stop spinner
        document.getElementById('spinner-field').classList.add('d-none');
        
        showError();
    }
}

document.getElementById('inputField').addEventListener('focus', ()=>{
    const inputValue = inputField.value;
    if(inputValue.length !== 0){
        document.getElementById('inputField').value = '';
    }
})

const showError= () => {
    const searchValue = document.getElementById('inputField').value;

    const errorField = document.getElementById('dataNotFound');
    const div = document.createElement("div");
    div.classList.add('card', 'text-white', 'bg-danger', 'my-5', 'mx-auto', 'w-75');
    div.innerHTML = `
        <div class="card-header">error</div>
        <div class="card-body">
            <p class="card-text">No Data Found for "${searchValue}", Try again....</p>
        </div>
    `;
    errorField.appendChild(div);
}