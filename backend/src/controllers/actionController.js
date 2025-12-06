const likeModel = require('../models/like.model');
const save = require('../models/save.model')
const foodModel = require('../models/food.model')
const ActionController = {};
ActionController.likefood = async (req, res) => {
    try {
           const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        userId: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            userId: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        userId: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    });
    } catch (error) {
        res.status(400).json({
            message:"Error liking the foodreel "
        })
    }
}

ActionController.saveFood = async (req,res)=>{
    const {foodId} = req.body;
    const user = req.user;
     
    try {
        
        //checking saved already or not
        const isSaved = await save.findOne({
            userId: user._id,
            food:foodId 
        })
    
        if(isSaved){
           await save.deleteOne({
                userId:user._id,
                food: foodId
            })
            await foodModel.findByIdAndUpdate(foodId,{
                $inc :{saveCount: -1}
            })
    
          return  res.status(200).json({message:"Removed from saved"})
        }
        
          const saveFood =  await save.create({
                userId: user._id,
                food:foodId
            })
    
            await foodModel.findByIdAndUpdate(foodId,{
                $inc : {saveCount : 1}
            })

            return res.status(201).json({
                message:"food saved Successfully",
                saveFood
            })

    } catch (error) {
        
          res.status(400).json({
            message:"Error saving the foodreel " + error.message,
        })
        console.log("Error in saving food:", error);
    }

    
}


module.exports = ActionController;