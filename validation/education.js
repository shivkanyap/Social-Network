const Validator = require('validator');
// import isEmpty from './is-empty'
const isEmpty = require('./is-empty');
module.exports=function validateEducationInput(data){
    let errors={};


    data.school=!isEmpty(data.school) ? data.school : '';
    data.fieldofstudy=!isEmpty(data.fieldofstudy) ? data.fieldofstudy :  '';
    data.degree=!isEmpty(data.degree) ? data.degree :  '';
    data.from=!isEmpty(data.from) ? data.from :  '';
    // data.to=!isEmpty(data.to) ? data.to :  '';
    // data.current=!isEmpty(data.current) ? data.current :  '';






    if(Validator.isEmpty(data.school)){
        errors.school="school field is required "
    }

   
    if(Validator.isEmpty(data.degree)){
        errors.degree="degree field is required "
    }
    if(Validator.isEmpty(data.from)){
        errors.from="From field is required "
    }
    
    if(Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy="fieldofstudy field is required "
    }


    
    return {
        errors,
        isValid:isEmpty(errors)
    }
}