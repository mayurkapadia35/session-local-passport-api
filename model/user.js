var mongoose=require('mongoose');

var UserDetail=mongoose.model("tbluserss",{
   username: {
       type: String

   },
    password: {
        type: String

    },
    name:{
        type: String
    }
});

module.exports={UserDetail};
