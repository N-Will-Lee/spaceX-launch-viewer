document.addEventListener('DOMContentLoaded', function(){
    //core variables
    let dropDown = document.querySelector('.dropDown');
    let rocketBadge = document.querySelector('.rocketBadge');
    let details = document.querySelector('.details');
    let video = document.querySelector('#rocketVideo');
    let dropDownStart = document.querySelector('#defaultDropDown');
    let nerdForm = document.querySelector('#nerdForm');

    //variables for data table on index.html
    let launchDate = document.querySelector('#launchDate');
    let missionSuccess = document.querySelector('#missionSuccess');
    let landedBooster = document.querySelector('#landedBooster');
    let payloadContents = document.querySelector('#payloadContents');
    let payloadNationality = document.querySelector('#payloadNationality');
    let reusedBooster = document.querySelector('#reusedBooster');
    
    //getting the spaceX API
    axios.get('https://api.spacexdata.com/v2/launches')
    .then(function(result)  {
        let rocketData = result.data;
        
        //render the dropdown menu
        assignDropDown(rocketData);
        
        //look for last selection choice in local storage
        getLocalStorage(rocketData)
        
        //rendering main page on rocket launch selection
        dropDown.addEventListener("change", function(){
            //changing the rocket badge, description, and embeded video depending on dropdown menu selection
            rocketBadge.setAttribute('src', rocketData[dropDown.value]['links']['mission_patch_small']);
            details.innerHTML = rocketData[dropDown.value]['details'];
            video.setAttribute('src', (rocketData[dropDown.value]['links']['video_link']).replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/'));
            
            //changing the data table based on dropdown menu selection
            launchDate.innerText = rocketData[dropDown.value]['launch_date_local'] || '-';
            missionSuccess.innerText = rocketData[dropDown.value]['launch_success'] || '-';
            landedBooster.innerText = rocketData[dropDown.value]['rocket']['first_stage']['cores'][0]['land_success'] || '-';
            payloadContents.innerText = rocketData[dropDown.value]['rocket']['second_stage']['payloads'][0]['payload_type'] || '-';
            payloadNationality.innerText = rocketData[dropDown.value]['rocket']['second_stage']['payloads'][0]['nationality'] || '-';
            reusedBooster.innerText = rocketData[dropDown.value]['reuse']['core'] || '-';

            //storing menu, badge, description, and video rendering in local storage
            localStorage.setItem('dropDownSelected', rocketData[dropDown.value]['mission_name'] + ' - ' + rocketData[dropDown.value]['launch_year']);
            localStorage.setItem('badgeSource',rocketData[dropDown.value]['links']['mission_patch_small']); 
            localStorage.setItem('details',(rocketData[dropDown.value]['details']) || '');
            localStorage.setItem('videoSource',(rocketData[dropDown.value]['links']['video_link']).replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/'));      
            
            //storing table data in local storage
            localStorage.setItem('lD', rocketData[dropDown.value]['launch_date_local'] || '-');
            localStorage.setItem('mS', rocketData[dropDown.value]['launch_success'] || '-');
            localStorage.setItem('lB', rocketData[dropDown.value]['rocket']['first_stage']['cores'][0]['land_success'] || '-');
            localStorage.setItem('pC', rocketData[dropDown.value]['rocket']['second_stage']['payloads'][0]['payload_type'] || '-');
            localStorage.setItem('pN', rocketData[dropDown.value]['rocket']['second_stage']['payloads'][0]['nationality'] || '-');
            localStorage.setItem('rB', rocketData[dropDown.value]['reuse']['core'] || '-');
            
        })
    })
    
    //event listner for submitting name and email on about page
    nerdForm.addEventListener('submit', submitNerdForm);
    

    //functions

    //re-rendering site from local storage
    function getLocalStorage(rocketData)    {
        //re-populating dropdown selection, rocket badge, details, video
        dropDownStart.innerHTML = localStorage.getItem('dropDownSelected') || 'Select A Rocket';
        rocketBadge.setAttribute('src', localStorage.getItem('badgeSource') || 'defaultBadge.jpeg');
        details.innerHTML = localStorage.getItem('details') || '';
        video.setAttribute('src', localStorage.getItem('videoSource') || '');

        //re-populating data table
        launchDate.innerText = localStorage.getItem('lD');
        missionSuccess.innerText = localStorage.getItem('mS');
        landedBooster.innerText = localStorage.getItem('lB');
        payloadContents.innerText = localStorage.getItem('pC');
        payloadNationality.innerText = localStorage.getItem('pN');
        reusedBooster.innerText = localStorage.getItem('rB');
    }
    
    //building out the dropdown menu with all of spaceX's launches
    function assignDropDown(rocketData) {
        for (let i=0; i<rocketData.length; i++) {
            let option = document.createElement('option');
            option.setAttribute('label', rocketData[i]['mission_name'] + ' - ' + rocketData[i]['launch_year']);
            option.setAttribute('value', [i]);
            dropDown.appendChild(option)
        }
    }

    //storing name and email submitted on about page in local storage
    function submitNerdForm()   {
        localStorage.setItem('username', document.querySelector('#nerdName').value);
        localStorage.setItem('userEmail', document.querySelector('#nerdEmail').value)
    }
})