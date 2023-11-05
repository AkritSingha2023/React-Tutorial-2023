var $sideNavEL = $('#directoryList');
var $dynamicContainer = $('#reactDynContainer');
var $closeMenu = $('#closeSideMenu');
var $sideBar = $('.fileNavigator.reactNavContainer');

// Get the ul element where the side navigation will be generated
const sideNav = document.getElementById('directoryList');

async function fetchHtml(url){
    if(url && url != ''){
        const result = await fetchHtmlAjaxReq(url);
    }
}

function fetchHtmlAjaxReq(url){
    $.ajax({
      url: url
    })
    .done(function( data ) {
        if($dynamicContainer){
            $dynamicContainer.empty();
            $dynamicContainer.append(data);
            utilFunction();
        }
    });
}


const folderStructure = window.folderStructure;
// Function to create a list item for a folder or file
function createListItem(item, parentUl, counter) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = item.title;

    if (item.type === 'folder') {
        const ul = document.createElement('ul');
        li.appendChild(a);
        a.classList.add('reactNavFolder');
        a.id = `item_${counter}`
        a.setAttribute('data-folder', counter);
        ul.id = `item_${counter}_ul`
        ul.classList.add('d-none')
        li.appendChild(ul);
        li.classList.add('folder')
        var counter_2 = 1;
        for (const property in item.properties) {
            if (item.properties.hasOwnProperty(property)) {
                createListItem(item.properties[property], ul, `${counter}_${counter_2}`);
                counter_2 += 1;
            }
        }
    } else if (item.type === 'file') {
        a.setAttribute('data-url', item.path);
        a.setAttribute('data-file', counter);
        a.classList.add('reactNavFile');
        li.appendChild(a);
        li.classList.add('file');
    }
    parentUl.appendChild(li);
}

if(window.folderStructure){
    // initiateNav(window.folderStructure)
    // Loop through the folder structure and create the side navigation
    var counter = 1
    for (const item in folderStructure) {
        if (folderStructure.hasOwnProperty(item)) {
            createListItem(folderStructure[item], sideNav, `${counter}`);
            counter += 1;
        }
    }

    var $navFileEl = $sideNavEL.find('a.reactNavFile');
    var $navFolderEl = $sideNavEL.find('a.reactNavFolder');
    var $fileEl = $sideNavEL.find('a.reactNavFile');
    window.tutorial = window.tutorial || {topicIndex: -1};
    $navFileEl.on("click", function(event){
        event.preventDefault();
        var element = event.currentTarget;
        try{
            var activeEL = $sideNavEL.find('li.file.active');
            if(activeEL.length > 0){
              activeEL[0].classList.remove('active');  
            }
            element.parentElement.classList.add('active');
            var dataUrl = element.dataset.url || '';
            fetchHtml(dataUrl);
        }catch(e){
            console.log(e);
        }finally{
            var fileData = element.dataset.file || '1_1_1';
            var arr = fileData.split('_');
            arr.pop();
            var finalString = arr.join('_');
            if(finalString && finalString.length > 0){
                var parentFolder = $sideNavEL.find(`a.reactNavFolder[data-folder="${finalString}"]`);
                if(parentFolder && parentFolder.length > 0){
                    parentFolder[0].click();
                }
            }
        }

    })   
    $navFolderEl.on("click", function(event){
        event.preventDefault();
        var element = event.currentTarget;
        var activeEL = $sideNavEL.find('li.folder.active');
        if(activeEL.length > 0){
            activeEL[0].classList.remove('active');  
        }
        var ulId = element.id + '_ul';
        element.parentElement.classList.add('active');
        if(element.getAttribute('data-open') && element.getAttribute('data-open') == 1){
            if($(`#${ulId}`).find('li.file.active').length == 0){
                $(`#${ulId}`).hide();
                element.setAttribute('data-open', 0); 
            } 
        }else{
            $(`#${ulId}`).show();
            element.setAttribute('data-open', 1);
            var folderData = element.dataset.folder || '1_1';
            var arr = folderData.split('_');
            arr.pop();
            var finalString = arr.join('_');
            if(finalString && finalString.length > 0){
                var parentFolder = $sideNavEL.find(`a.reactNavFolder[data-folder="${finalString}"]`);
                if(parentFolder && parentFolder.length > 0){
                    parentFolder[0].click();
                }
            }
        }
    })   
    $closeMenu.on("click", function(event){
        event.preventDefault();
        var element = event.currentTarget;
        if(element.getAttribute('data-open') && element.getAttribute('data-open') == 1){
            $sideBar.addClass('close');
            $closeMenu.addClass('right');
            $closeMenu.addClass('openFixedArrowBtn');
            element.setAttribute('data-open', 0);   
        }else{
            $sideBar.removeClass('close');
            $closeMenu.removeClass('right');
            $closeMenu.removeClass('openFixedArrowBtn');
            element.setAttribute('data-open', 1);
        }
    })

    function toggleScreen(index){
        var currentIndex = window.tutorial.topicIndex || 0;
        try{
            if($fileEl[currentIndex + index]){
                $fileEl[currentIndex + index].click();
                window.tutorial.topicIndex += index;
            }
        }
        catch(e){}
    }

    $('#showPrev').on("click", function(event){
        event.preventDefault();
        toggleScreen(-1)
    })

    $('#showNext').on("click", function(event){
        event.preventDefault();
        toggleScreen(1)
    })
    toggleScreen(1);
    console.log(window.innerWidth);
    if(window.innerWidth < 840){
        $('#closeSideMenu').click();
    }
}