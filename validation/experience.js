const Validator = require('validator');
// import isEmpty from './is-empty'
const isEmpty = require('./is-empty');
module.exports=function validateExperienceInput(data){
    let errors={};


    data.title=!isEmpty(data.title) ? data.title : '';
    data.company=!isEmpty(data.company) ? data.company :  '';
    // data.location=!isEmpty(data.location) ? data.location :  '';
    data.from=!isEmpty(data.from) ? data.from :  '';
    // data.to=!isEmpty(data.to) ? data.to :  '';
    // data.current=!isEmpty(data.current) ? data.current :  '';






    if(Validator.isEmpty(data.title)){
        errors.title="Title field is required "
    }

   
    if(Validator.isEmpty(data.company)){
        errors.company="Company field is required "
    }
    if(Validator.isEmpty(data.from)){
        errors.from="From field is required "
    }


    
    return {
        errors,
        isValid:isEmpty(errors)
    }
}