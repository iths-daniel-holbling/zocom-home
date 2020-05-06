const appWrapper = document.querySelector('#app-wrapper');
const authKey = {
    headers: {
        'Authorization':'69420lol'
    }
};

let getDevices = async () => {
    let devices = await fetch('/devicelist', authKey);
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

    let eventTargets = {type:type};
    let lowerCaseType = type.toLowerCase();

    if(type === "AC"){
        lowerCaseType = "AC";
    }
    let windowElement = crEl("div",`window ${type}-window`)
    appWrapper.append(windowElement);

    let titleBar = crEl("div","title-bar");
    windowElement.append(titleBar);

    let titleBarText = crEl("div", "title-bar-text");
    let titleBarControls = crEl("div", "title-bar-controls");
    titleBarText.innerText = type + "s";
    titleBar.append(titleBarText,titleBarControls);

    let windowBody = crEl("div","window-body");
    windowElement.append(windowBody);

    let fieldSet = crEl("fieldset");
    windowBody.append(fieldSet);

    let fieldSetLegend = crEl("legend");
    fieldSetLegend.innerText = `Which ${lowerCaseType}?`;
    fieldSet.append(fieldSetLegend);
    
    let choiceArr = [];
    let devId = [];
    
    arr.forEach((item) => {
        let i = item.toLowerCase();
        let fieldRow = crEl("div","field-row");
        fieldRow.innerHTML = `
            <input id="${i}-radio-btn" type="radio" name="${type}-radio-btn" value="${item}">
            <label for="${i}-radio-btn">${item}</label>
        `
        fieldSet.append(fieldRow);
        choiceArr.push(fieldRow);
        devId.push(item);
    })
    eventTargets["radioButtons"] = choiceArr;
    eventTargets["devId"] = devId;


    let br1 = crEl('br');
    windowBody.append(br1);

    if(type === "AC"){
        let tempSlider = crEl('div', 'field-row');
        tempSlider.innerHTML = `
            <label for='${type}-temp-slider' class="display-temp">Temperature</label>
            <input type="range" min="16" max="30" value="23" id='${type}-temp-slider'>
            <span class="temp-text">23C</span>
        `;
        windowBody.append(tempSlider);
        eventTargets["tempSlider"] = tempSlider;

    }

    if(type === "Light"){
        let color = crEl('div','field-row');
        color.innerHTML = `
            <label for="temp-text">Color</label>
            <input type="color" id="light-color">
        `
        eventTargets["color"] = color;

        let brightness = crEl('div','field-row');
        brightness.innerHTML = `
            <label for='${type}-brightness-slider' class="display-temp">Brightness</label>
            <input type="range" min="1" max="100" value="100" id='${type}-brightness-slider'>
            <span class="temp-text">100%</span>
        `;
        eventTargets["brightness"] = brightness;

        windowBody.append(color, brightness);

    }
    if(type === "Lock"){
        
    }
    if(type === "Vacuum"){
        
    }
    


    let br2 = crEl('br');
    windowBody.append(br2)

    let onBtn = crEl('button','on-btn');
    onBtn.innerText = "Turn on";
    eventTargets["onBtn"] = onBtn;

    let offBtn = crEl('button', 'off-btn');
    offBtn.innerText = "Turn off";
    eventTargets["offBtn"] = offBtn;

    windowBody.append(onBtn, offBtn);


    return eventTargets;


}

const setEventListeners = (devices) => {
    let type = devices.type.toLowerCase() + "s";
    console.log(type);
    let radioArr = document.getElementsByName(`${devices.type}-radio-btn`);
    
    
    devices.onBtn.addEventListener('click', () => {
        radioArr.forEach(async (btn) => {
            if(btn.checked === true){
                await fetch(`/${type}/${btn.value}/power/on`, authKey);
            }
        })
    })

    devices.offBtn.addEventListener('click', () => {
        radioArr.forEach(async (btn) => {
            if(btn.checked === true){
                await fetch(`/${type}/${btn.value}/power/off`, authKey);
            }
        })
    })
    
    if(type === "acs"){
        let temperature = devices.tempSlider.children[1];
        let tempLabel = devices.tempSlider.children[2];
        temperature.addEventListener('change', (e) => {
            radioArr.forEach(async (btn) => {
                if(btn.checked === true){
                    await fetch(`/${type}/${btn.value}/temperature/${e.target.value}`, authKey);
                }
            })
            tempLabel.innerText = e.target.value + "C";
        })
    }

    if(type === "lights"){

        let color = devices.color.children[1];
        console.log(color.value.split('#')[1]);
        color.addEventListener('change', e => {
            let val = color.value.split('#')[1];
            radioArr.forEach(async (btn) => {
                if(btn.checked === true){
                    await fetch(`/${type}/${btn.value}/color/${val}`, authKey);
                }
            })
        })

        let brightness = devices.brightness.children[1];
        let brightLabel = devices.brightness.children[2];
        brightness.addEventListener('change', (e) => {
            radioArr.forEach(async (btn) => {
                if(btn.checked === true){
                    await fetch(`/${type}/${btn.value}/brightness/${e.target.value/100}`, authKey);
                }
            })
            brightLabel.innerText = e.target.value + "%";
        })
    }
    
    
    

}


(async () => {
    
    let devices = await getDevices();
    let acs = markup(devices.acs, "AC");
    let blinds = markup(devices.blinds, "Blind");
    let cameras = markup(devices.cameras, "Camera");
    let lights = markup(devices.lights, "Light");
    let locks = markup(devices.locks, "Lock");
    let vacuums = markup(devices.vacuums, "Vacuum");
    await setEventListeners(acs);
    await setEventListeners(blinds);
    await setEventListeners(cameras);
    await setEventListeners(lights);
    await setEventListeners(locks);
    await setEventListeners(vacuums);
})()




