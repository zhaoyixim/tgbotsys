let params1 = "ONT8"; //仓库
let params9 = "7QQ7CNVH"; // 提取码
let params6 = 24 ; //日期到号
let mouthsetting = "10";//10月份

let params3 = "PALLETIZED"; //类型
let randomsetnum1 = 7
let randomsetnum2 = 24
let params2 = "TL";
let params4 = "false";//选择NO
let params5 = "";
let params7 = 8; //hours
let params8 = "" ; //minus
let params10 = "26";

let limitdayset = 3

function getRandomDelay() {
    return Math.floor(Math.random() * (5000 - 2000 + 1)) + 1000;
}
function simulateInput(element, values) {
    element.value = values; 
    const inputEvent = new Event('input', { bubbles: true });
    element.dispatchEvent(inputEvent);
}
let stopturnone = false;
let stopturntwo = false;
let doNextStep = false;
let yeardata = 2024;
function getNextDates(getmonthdata, days) {
    const [month, day] = getmonthdata.split('/').map(Number);
    const date = new Date(yeardata, month - 1, day); // 假设年份为 2023
    const nextDates = [];
    for (let i = 1; i <= days; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + i);
        const formattedDate = `${nextDate.getMonth() + 1}/${nextDate.getDate()}`;
        nextDates.push(formattedDate);
    }
    return nextDates;
}


function doFunction() { 
    setTimeout(function() {       
        console.log('延迟1秒后执行的代码');
    }, 500);
    let inputElementsNgOKK = document.getElementsByClassName('a-text-left ng-binding');
    if (undefined != inputElementsNgOKK && inputElementsNgOKK.length>0){

        stopturntwo = true;
        stopturnone = true ; 
        doNextStep = true; 

        // for (let i = 0; i < inputElementsNgOKK.length; i++) {
        //     let dateString = inputElementsNgOKK[i].textContent;
        //     let resultstring = dateString.replace(/\s*\(.*?\)/, ''); 
        //     let mousettingpatch = mouthsetting + '/'+ params6.toString();
        //     let getlimitdatas = getNextDates(mousettingpatch,limitdayset);
        //     getlimitdatas.some(item => {                
        //         if (resultstring == item){
        //             console.log('成功了。等待处理');
        //             stopturntwo = true;
        //             stopturnone = true ; 
        //             doNextStep = true; 
        //             return true
        //         }
        //         return false;
        //     });
        //     if(doNextStep){break ;} 
        // }  
        
        if(doNextStep){
            let conformBtn = document.querySelector(`[data-action="ConfirmTimeslot"]`);
            conformBtn.click()
        }else{
                stopturnone = true;              
                console.log('失败了，重新开始，请执行第二套程序');
                doFunctiontwo();
                return true
        }   

    }
    
    params10 = (Math.floor(Math.random() * randomsetnum1) + randomsetnum2).toString();
    let dropdown2 = document.getElementById('freight_dropdown');
    dropdown2.value = params2; 
    let event2 = new Event('change', { bubbles: true });
    dropdown2.dispatchEvent(event2);
    let dropdown3 = document.getElementById('load_dropdown');
    dropdown3.value = params3; 
    let event3 = new Event('change', { bubbles: true });
    dropdown3.dispatchEvent(event3);
    let dropdown4 = document.getElementById('clamp_dropdown');
    dropdown4.value = params4; 
    let event4 = new Event('change', { bubbles: true });
    dropdown4.dispatchEvent(event4);
    let dropdown1 = document.getElementById('fc_dropdown');
    dropdown1.value = params1; 
    let optionToSelect = document.querySelector(`option[value="${params1}"]`);
    optionToSelect.selected = true;
    let event1 = new Event('change', { bubbles: true });
    dropdown1.dispatchEvent(event1);
    let inputaddonElements =  document.getElementById('calendarInputId');
    inputaddonElements.value = mouthsetting + "/"+params6.toString() +"/"+yeardata.toString();  
    let numtemp = 29 ;
    let inputElementsNgScope2 = document.getElementsByClassName('ng-scope');
    if (undefined == inputElementsNgScope2[numtemp].children[6]){
         numtemp = 30;
    }         
   let aCalDaysFixed = document.getElementsByClassName('a-bordered a-vertical-stripes a-align-center a-spacing-none');        
    if (undefined != aCalDaysFixed [1].children[0].children[1].children[0].children[0]){
          aCalDaysFixed [1].children[0].children[1].children[0].children[0].click();
    } 
    simulateInput(inputElementsNgScope2[numtemp].children[2].children[0], params9); 
    simulateInput(inputElementsNgScope2[numtemp].children[5].children[0], params10); 
    simulateInput(inputElementsNgScope2[numtemp].children[8].children[0], params9);   
    return false
}
function doSubmit(){  
    let dropdownsubmit = document.querySelector('[data-action="CreateAppointment"]');
    let inputElementsNgScopeSuccess = document.getElementsByClassName('a-box a-alert a-alert-success');
    let inputElementsNgScopeWarning = document.getElementsByClassName('a-box a-alert a-alert-warning');
    let inputElementsNgScopeError = document.getElementsByClassName('a-box a-alert a-alert-error');  
    if (inputElementsNgScopeError .length ==1){
        //alert("出现错误，请先排除")
        let elementreset = document.querySelector('[data-action="RestoreAppointment"]');
        elementreset.click();
        setTimeout(function() {       
            console.log("出现错误");
        }, 500);
        return false;
    }
    if(inputElementsNgScopeSuccess.length>0){        
        //inputElementsNgScopeSuccess[0].children[0].children[1].children[1].click();
        let elementreset = document.querySelector('[data-action="RestoreAppointment"]');
        elementreset.click();
        setTimeout(function() {       
            console.log("延迟1秒后执行的代码---1111");
        }, 500);
        return false; 
    }
    if(inputElementsNgScopeWarning.length>3){        
        let elementreset = document.querySelector('[data-action="RestoreAppointment"]');
        elementreset.click();
        setTimeout(function() {       
            console.log("延迟1秒后执行的代码--重新按下");
        }, 500);
        return false; 
    } else if("undefined" != dropdownsubmit){
        console.log("点击了--正常执行");
        if (dropdownsubmit && typeof dropdownsubmit.click === 'function') {
            dropdownsubmit.click(); // 调用 click 方法
        }
    }else{
        console.log("出错了");
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
    let getnextslotsubmit = document.querySelector('[data-action="GetNextTimeslots"]');
    getnextslotsubmit.click();
    setTimeout(function() {       
        console.log("等待s执行，防止出现hide");
        let inputaddonPOPinptElements =  document.getElementById('calendarPopupInputId');                
        inputaddonPOPinptElements.value = mouthsetting +"/"+params6 +"/2024";
        let getnextslotsubmitBTN = document.querySelector('[data-action="ChangeCRDDAccept"]');            
        getnextslotsubmitBTN.click();
        doFunctiontwo()  ;
    }, 2000); 
}
function doFunctiontwo() {  
    let inputElementsNgOKK = document.getElementsByClassName('a-text-left ng-binding');
    if (undefined != inputElementsNgOKK && inputElementsNgOKK.length>0){
        // 已经成功了
        let dateString = inputElementsNgOKK[0].textContent;
        if(dateString != ""){
            let resultstring = dateString.replace(/\s*\(.*?\)/, ''); // 移除括号和括号中的内容
            let mousettingpatch = mouthsetting + "/"+ params6;
            if (resultstring == mousettingpatch){
                // 结束之后，等待confirm
                console.log("成功了。等待处理");
                stopturntwo = true;
            }else{
                stopturnone = false  ;
                console.log("失败了重新开始");              
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
        console.log("延迟5秒后执行的代码");
        doSubmitTwoStep();
    }, 5000);     
}
executeLoop();