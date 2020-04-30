const appWrapper = document.querySelector('#app-wrapper');

let getDevices = async () => {
    let devices = await fetch('http://localhost:3000/devicelist', {
        headers: {
            'Authorization':'69420lol'
        }
    });
    return devices.json();
}

let crEl = (elType, classes) => {
    let element = document.createElement(elType);
    if(!!classes){
        element.className = classes;
    }
    return element;
}

function markup(arr, type){
    let lowerCaseType = type.toLowerCase();
    if(type === "AC"){
        lowerCaseType = "AC";
    }
    let windowElement = crEl("div",`window ${type}-window`)
    windowElement.style.width = "300px";
    appWrapper.appendChild(windowElement);

    let titleBar = crEl("div","title-bar");
    windowElement.appendChild(titleBar);

    let titleBarText = crEl("div", "title-bar-text");
    let titleBarControls = crEl("div", "title-bar-controls");
    titleBarText.innerText = type + "s";
    titleBar.append(titleBarText,titleBarControls);

    let windowBody = crEl("div","window-body");
    windowElement.appendChild(windowBody);

    let fieldSet = crEl("fieldset");
    windowBody.appendChild(fieldSet);

    let fieldSetLegend = crEl("legend");
    fieldSetLegend.innerText = `Which ${lowerCaseType}?`;
    fieldSet.appendChild(fieldSetLegend);
    arr.forEach((item) => {
        let i = item.toLowerCase();
        let fieldRow = crEl("div","field-row");
        fieldRow.innerHTML = `
            <input id="${i}-radio-btn" type="radio" name="${i}-radio-btn">
            <label for="${i}-radio-btn">${item}</label>
        `
        fieldSet.appendChild(fieldRow);
    })

    let br1 = crEl('br');
    windowBody.appendChild(br1);

    // Lägg in element som skiljer sig mellan typer
    if(type === "AC"){
        let slideContainer = crEl('div', 'slidecontainer');
        slideContainer.innerHTML = `
            <input type="range" min="1" max="100" value="50" class="slider">
            <p class="display-temp"></p>
        `;
        let temperature = crEl('div','field-row');
        temperature.innerHTML = `
            <label for="temp-text">Temperature</label>
            <input type="text" id="temp-text">
            <button>Set</button>
        `
        windowBody.append(slideContainer,temperature);
    }
    if(type === "Blind"){
        
    }
    if(type === "Camera"){
        
    }
    if(type === "Light"){
        let color = crEl('div','field-row');
        color.innerHTML = `
            <label for="temp-text">Color</label>
            <input type="color" id="light-color">
            <button>Set</button>
        `

        // Gör en för brightness också

        windowBody.append(color);
    }
    if(type === "Lock"){
        
    }
    if(type === "Vacuum"){
        
    }
    


    let br2 = crEl('br');
    windowBody.appendChild(br2)
    let onBtn = crEl('button','on-btn');
    onBtn.innerText = "Turn on";
    let offBtn = crEl('button', 'off-btn');
    offBtn.innerText = "Turn off";
    windowBody.append(onBtn, offBtn);




}




(async () => {
    
    let devices = await getDevices();
    // devices.acs, devices.blinds, devices.cameras, devices.lights, devices.locks, devices.vacuums
    markup(devices.acs, "AC");
    markup(devices.blinds, "Blind");
    markup(devices.cameras, "Camera");
    markup(devices.lights, "Light");
    markup(devices.locks, "Lock");
    markup(devices.vacuums, "Vacuum");
})()




