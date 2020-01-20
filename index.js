//?Function to  get url
const getUrl = (start = 0) => {
    return `https://api.coinlore.com/api/tickers/?start=${start}&limit=10`;
}

//?Function to get data from the API
const getData = url => {
    fetch(url)
    .then((res) => res.json())
    .then(data => loadDataIntoTable(data))
    .catch(err => console.log(err));
}

//?Function to load data gotten from the API into the table
const loadDataIntoTable = data => {
    let coinName = [];
    let coinPrice = [];
    let coinSymbol = [];
    let coinRank = [];
    let coinChange = [];

    // console.log(data);

    data['data'].forEach(coin => {
        coinName.push(coin.name);
        coinPrice.push(coin.price_usd);
        coinSymbol.push(coin.symbol);
        coinRank.push(coin.rank);
        coinChange.push(coin.percent_change_24h);
    });

    let tableBody = document.getElementById('crypto-table-body');

    let html = "";

    for (let i = 0; i < coinName.length; i++) {
        html += `<tr>`;
        html += `<td>${coinName[i]}(${coinSymbol[i]})</td>`;
        html += `<td>${coinRank[i]}</td>`;
        html += `<td>$${coinPrice[i]}</td>`;
        if (coinChange[i] > 0) {
            html += `<td class="green-text">+${coinChange[i]}</td>`;
        } else {
            html += `<td class="red-text">${coinChange[i]}</td>`;
        }
        html += `</tr>`
    }

    tableBody.innerHTML = html
}

const handleNumberClick = (clickedLink, leftArrow, rightArrow) => {
    //!Add active class to li
    clickedLink.parentElement.classList = 'active';

    //!Get page number
    let clickedLinkPageNumber = parseInt(clickedLink.innerText);

    //!Get url
    const url = getUrl((clickedLinkPageNumber * 10) - 10);
    getData(url);

    switch (clickedLinkPageNumber) {
            case 1:
                disableLeftArrow(leftArrow);
                if (rightArrow.className.indexOf('disabled') !== -1) {
                    enableRightArrow(rightArrow);
                }
            break;

            case 10:
                disableRightArrow(rightArrow);
                if (leftArrow.className.indexOf('disabled') !== -1) {
                    enableLeftArrow(leftArrow);
                }
            break;

        default:
            if (leftArrow.className.indexOf('disabled') !== -1) {
                enableLeftArrow(leftArrow);
            }
            if (rightArrow.className.indexOf('disabled') !== -1) {
                enableRightArrow(rightArrow);
            }
            break;
    }
}

const handleLeftArrowClick = (activePageNumber, leftArrow, rightArrow) => {
    //Move to previous page
    let previousPage = document.querySelectorAll('li')[activePageNumber - 1];
    previousPage.classList = 'active';

    url = getUrl(((activePageNumber - 1) * 10) - 10);
    getData(url);

    if (activePageNumber === 10) {
        enableRightArrow(rightArrow);
    }

    if (activePageNumber - 1 === 1) {
        disableLeftArrow(leftArrow);
    }
}

const handleRightArrowClick = (activePageNumber, leftArrow, rightArrow) => {
    //Move to the next page
    let nextPage = document.querySelectorAll('li')[activePageNumber + 1];
    nextPage.classList = 'active';

    url = getUrl(((activePageNumber + 1) * 10) - 10);
    getData(url);

    if (activePageNumber === 1) {
        enableLeftArrow(leftArrow);
    }

    if (activePageNumber + 1 === 10) {
        disableRightArrow(rightArrow);
    }
}

const disableLeftArrow = leftArrow => {
    leftArrow.classList = 'disabled arrow-left';
    leftArrow.classList.remove('waves-effect');
}

const enableLeftArrow = leftArrow => {
    leftArrow.classList.remove('disabled');
    leftArrow.classList = 'waves-effect arrow-left';
}

const disableRightArrow = rightArrow => {
    rightArrow.classList = 'disabled arrow-right';
    rightArrow.classList.remove('waves-effect');
}

const enableRightArrow = rightArrow => {
    rightArrow.classList.remove('disabled');
    rightArrow.classList = 'waves-effect arrow-right';
}


const init = () => {
    const url = getUrl();
    getData(url);
}

init();

//?Handle the pagination

let pageLinks = document.querySelectorAll('a');
let activePageNumber, clickedLink, leftArrow, rightArrow;
let url = '';

pageLinks.forEach(el => {
    el.addEventListener('click', function() {
        leftArrow = document.querySelector('.arrow-left');
        rightArrow = document.querySelector('.arrow-right');
        activeLink = document.querySelector('.active');

        //!Get ative page number
        activePageNumber = parseInt(activeLink.innerText);

        if ((this.innerText === 'chevron_left' && activePageNumber === 1) || (this.innerText === 'chevron_right' && activePageNumber === 10)) {
            return;
        }

        //!Update active class
        activeLink.classList = 'waves-effect';
        activeLink.classList.remove('active');

        if (this.innerText === 'chevron_left') {
            handleLeftArrowClick(activePageNumber, leftArrow, rightArrow);
        } else if (this.innerText === 'chevron_right') {
            handleRightArrowClick(activePageNumber, leftArrow, rightArrow);
        } else {
            handleNumberClick(this, leftArrow, rightArrow);
        }
    });
});



