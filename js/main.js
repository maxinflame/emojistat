const tableNode = document.querySelector('[data-role="table"]');

const createTable = () => {
    createRequest(writeEmojiesInTable);
}

const createRequest = (onSuccess) => {
    const REQUEST_URL = 'https://api.emojitracker.com/v1/rankings';

    fetch(REQUEST_URL)
        .then(response => {
            return response.json();
        })
        .then(AllEmojiesArray => {
            onSuccess(AllEmojiesArray)
        })
}

const writeEmojiesInTable = (emojiesArray) => {
    const topTenEmojies = emojiesArray.slice(0, 10);

    topTenEmojies.forEach(emoji => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${emoji.char}</td><td data-emoji-id="${emoji.id}">${emoji.score}</td>`
        tableNode.appendChild(row);
    });

    setTableUpdates(topTenEmojies);
    drawDiagrams(topTenEmojies);
}

const setTableUpdates = (topTenEmojies) => {
    const REQUEST_URL = "https://stream.emojitracker.com";
    let responseEvent = new EventSource(`${REQUEST_URL}/subscribe/eps`);
    
    let topTenEmojiesID = [];
    topTenEmojies.forEach(emoji => {
        topTenEmojiesID.push(emoji.id);
    })


    responseEvent.onmessage = (event) => {
        const updates = JSON.parse(event.data);
        updateTable(updates, topTenEmojiesID)
    }
}

const updateTable = (updatesObject, topTenEmojiesID) => {
    Object.keys(updatesObject).forEach(id => {
        if (topTenEmojiesID.includes(id)) {
            const tableCell = tableNode.querySelector(`[data-emoji-id="${id}"]`);
            const newValue = Number(tableCell.innerText) + Number(updatesObject[id]);
            tableCell.innerHTML = newValue;
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    createTable();
})

const drawDiagrams = (emojiesArray) => {
    const diagramsWrapper = document.querySelector('[data-diagram="wrapper"]');

    const highestScore = emojiesArray[0].score

    emojiesArray.forEach(emoji => {
        const diagramWrapper = document.createElement('div');
        diagramWrapper.classList.add('diagram-wrapper');

        const diagram = document.createElement('div');
        diagram.classList.add('diagram');
        diagram.style.height = `${(emoji.score / highestScore) * 100}%`;
        diagramWrapper.append(diagram);

        const diagramName = document.createElement('span');
        diagramName.innerText = emoji.char;
        diagramWrapper.append(diagramName);

        diagramsWrapper.append(diagramWrapper);

    })
}