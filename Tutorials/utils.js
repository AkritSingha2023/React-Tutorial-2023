function utilFunction(){
    var $codeElement = $('figure.code pre.write-html-code');
    $codeElement.each(function(index, item){
        item.innerText = item.innerText.replaceAll(' ','  ')
    });
}
function initiateNextTopicButton(){
    $('#footerPrevTopicButton').click(function(){
        toggleScreen(-1)
    })
    $('#footerNextTopicButton').click(function(){
        toggleScreen(1)
    })
}