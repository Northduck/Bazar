"use strict";

module.exports=(infoToPrepare)=>{
    let preparedInfo={};
    for (const infoValueName in infoToPrepare) {
        if (infoToPrepare.hasOwnProperty(infoValueName)) {
            const element = infoToPrepare[infoValueName];
            let newValueName=infoValueName.toLowerCase();
            newValueName=newValueName.replace(/Review-|review-|review|Review|Review[-_]|review[-_]|[-_]/g,"");
            preparedInfo[newValueName]=element;
        }
    }
    return preparedInfo;
}