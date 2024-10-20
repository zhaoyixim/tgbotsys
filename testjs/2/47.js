let params6 = 21  //14号
let stopturntwo = false

function doSubmitTwoStep(){
    let getnextslotsubmit = document.querySelector('[data-action="GetNextTimeslots"]');
    getnextslotsubmit.click()
    setTimeout(function() {       
        console.log("等待s执行，防止出现hide");
        let inputaddonPOPinptElements =  document.getElementById('calendarPopupInputId');
        //inputaddonPOPinptElements.click()
                
        inputaddonPOPinptElements.value = mouthsetting +"/"+params6 +"/2024"    
        let getnextslotsubmitBTN = document.querySelector('[data-action="ChangeCRDDAccept"]');            
        getnextslotsubmitBTN.click()
        doFunctiontwo()  
    }, 2000);        
    
}

function doFunctiontwo() {  

    let inputElementsNgOKK = document.getElementsByClassName('a-text-left ng-binding');

    if (undefined != inputElementsNgOKK && inputElementsNgOKK.length>0){
        // 已经成功了
        let dateString = inputElementsNgOKK[0].textContent
        if(dateString != ""){
            let resultstring = dateString.replace(/\s*\(.*?\)/, ''); // 移除括号和括号中的内容
            let mousettingpatch = mouthsetting + "/"+ params6
            if (resultstring == mousettingpatch){
                // 结束之后，等待confirm
                console.log("成功了。等待处理")
                stopturntwo = true
            }else{
                stopturnone = false  
                console.log("失败了重新开始")              
                executeLooptwoStep()            

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
        doSubmitTwoStep()
    }, 5000);
  
    
}
doFunctiontwo()
