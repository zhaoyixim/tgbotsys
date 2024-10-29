// const timeslotsBtns = document.querySelectorAll('#availableTimeslots');        
        // const timeslotsEvent = new Event('click');
        // timeslotsBtns[i].children[0].children[0].children[0].children[0].click();
function doSubmit(){  
    let dropdownsubmit = document.querySelector(`[data-action='CreateAppointment']`);
    let inputElementsNgScopeSuccess = document.getElementsByClassName('a-box a-alert a-alert-success');
    let inputElementsNgScopeWarning = document.getElementsByClassName('a-box a-alert a-alert-warning');
    let inputElementsNgScopeError = document.getElementsByClassName('a-box a-alert a-alert-error');  
    if (inputElementsNgScopeError .length ==1){
        //alert("出现错误，请先排除")
        let elementreset = document.querySelector(`[data-action='RestoreAppointment']`);
        elementreset.click();
        setTimeout(function() {       
            console.log('出现错误');
        }, 500);
        return false;
    }
    let elementreset = document.querySelector(`[data-action='RestoreAppointment']`);
    if(inputElementsNgScopeSuccess.length>0){        
        elementreset.click();
        setTimeout(function() {       
            console.log('延迟1秒后执行的代码');
        }, 500);
        return false; 
    }
    if(inputElementsNgScopeWarning.length>3){        
        elementreset.click();
        setTimeout(function() {       
            console.log('延迟1秒后执行的代码--重新按下');
        }, 500);
        return false; 
    } else if(undefined != dropdownsubmit){
        if (dropdownsubmit && typeof dropdownsubmit.click === 'function') {
            dropdownsubmit.click(); // 调用 click 方法
        }
    }else{
        console.log('出错了');
    }   
    return false; 
}
function executeLoop() {    
    if (stopturnone){
        return
    }    
    if (doFunction() || doSubmit()) {
         return; 
    }        
    setTimeout(() => {
            doFunction();
            setTimeout(() => {               
                doSubmit();
                executeLoop(); 
            }, getRandomDelay()); 
    }, getRandomDelay());   
}
function doSubmitTwoStep(){
    let getnextslotsubmit = document.querySelector(`[data-action='GetNextTimeslots']`);
    getnextslotsubmit.click();
    setTimeout(function() { 
        let inputaddonPOPinptElements =  document.getElementById('calendarPopupInputId');                
        inputaddonPOPinptElements.value = mouthsetting +'/'+params6 +'/2024';
        let getnextslotsubmitBTN = document.querySelector(`[data-action='ChangeCRDDAccept']`);            
        getnextslotsubmitBTN.click();
        doFunctiontwo()  ;
    }, 2000); 
}
function doFunctiontwo() {  
    let inputElementsNgOKK = document.getElementsByClassName('a-text-left ng-binding');
    if (undefined != inputElementsNgOKK && inputElementsNgOKK.length>0){
        // 已经成功了
        let dateString = inputElementsNgOKK[0].textContent;
        if(dateString != ''){
            let resultstring = dateString.replace(/\s*\(.*?\)/, ''); // 移除括号和括号中的内容
            let mousettingpatch = mouthsetting + "/"+ params6;
            if (resultstring == mousettingpatch){
                // 结束之后，等待confirm
                console.log('成功了。等待处理');
                stopturntwo = true;
            }else{
                stopturnone = false  ;
                console.log('失败了重新开始');              
                executeLooptwoStep();
            }
        } 
    }
}
function executeLooptwoStep() {
    if (stopturntwo){
        return
    }
    setTimeout(function() {       
        console.log('延迟5秒后执行的代码');
        doSubmitTwoStep();
    }, 5000);     
}
executeLoop();