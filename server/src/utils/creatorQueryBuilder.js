const User = require("../model/User");

const buildQuery = async(query) => {

    const {
                q,
                sort,
                page,
                country,
                state,
                city,
                cameraBrand,
                cameraModel,
                experience,
                mainLens
            } = query;
    
    let creatorSearchQuery={}
    if(q){
        const users = await User.find({
                username: {
                    $regex: q,
                    $options: "i"
                }
            }).select("_id");
    const userIds = users.map(user => user._id);
        creatorSearchQuery={
        $or:[
            {
            displayName:{
                $regex:q,
                $options:"i"
            },
        },
        {
            user: {
                $in: userIds
            },
        },
        {
            bio:{
                $regex:q,
                $options:"i"
            }
        },{
            country:{
                $regex:q,
                $options:"i"
            }
        },
        {
            state:{
                $regex:q,
                $options:"i"
            }
        },
        {
            experience:{
                $regex:q,
                $options:"i"
            }
        },
        {
            cameraBrand:{
                $regex:q,
                $options:"i"
            }
        },
        {
            cameraModel:{
                $regex:q,
                $options:"i"
            }
        },
        {
            mainLens:{
                $regex:q,
                $options:"i"
            }
        },
        {
            specialization:{
                $regex:q,
                $options:"i"
            }
        }
        ]
        }
    }

    let filterQuery={};
    if(country){
        filterQuery.country={
            $regex:country,
            $options:"i"
        }
    }
    if(state){
        filterQuery.state={
            $regex:state,
            $options:"i"
        }
    }
    if(city){
        filterQuery.city={
            $regex:city,
            $options:"i"
        }
    }
    if(cameraBrand){
        filterQuery.cameraBrand={
            $regex:cameraBrand,
            $options:"i"
        }
    }
    if(cameraModel){
        filterQuery.cameraModel={
            $regex:cameraModel,
            $options:"i"
        }
    }
    if(experience){
        filterQuery.experience={
            $regex:experience,
            $options:"i"
        }
    }
    if(mainLens){
        filterQuery.mainLens={
            $regex:mainLens,
            $options:"i"
        }
    }
    
    let finalQuery={};
    if(q && Object.keys(filterQuery).length>0){
        finalQuery={
            $and:[
                creatorSearchQuery,
                filterQuery
            ]
        }
    }else if(q){
        finalQuery= creatorSearchQuery;
    }else{
        finalQuery=filterQuery;
    }

    let sortOption={createdAt : -1};
    if(sort==="oldest"){
        sortOption={createdAt : 1};
    }

    const limit=10;
    const currentPage=Number(page)||1;
    const skip= (currentPage-1)*limit;

    return {
        finalQuery,
        sortOption,
        currentPage,
        limit,
        skip
    }
};

module.exports = buildQuery;