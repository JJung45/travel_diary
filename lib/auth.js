module.exports={
    isOwner:function(req,res){
        if(req.user){
          return true;
        }else{
          return false;
        }
      },
      statusUI: function(req,res){
          var owner = '';
          if(this.isOwner(req,res)){
              owner = req.user.userId;
          }
          return owner;
      }
    }